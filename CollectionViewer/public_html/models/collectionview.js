/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var mylib = mylib || {};
mylib.utils = mylib.utils || {};

mylib.utils.collections = (function(window, $) {

    var app_defaults = {};

    Object.defineProperty(app_defaults, "zero_opacity", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: 0.001
    });

    Object.defineProperty(app_defaults, "full_opacity", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: 1.00
    });

    Object.defineProperty(app_defaults, "show_hide_delay", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: 450
    });

    Object.defineProperty(app_defaults, "resize_delay", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: 100
    });

    Object.defineProperty(app_defaults, "item_visible_class", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: "item-visible"
    });

    Object.defineProperty(app_defaults, "item_hidden_class", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: "item-hidden"
    });

    function createObservable(initialValue) {
        return ko.observable(initialValue);
    }

    function createObservableArray(initialData) {
        return ko.observableArray(initialData);
    }
    
    function createComputed(func, binder) {
        return ko.computed(func, binder);
    }

    function ItemContainer(id, model, idPrefix) {
        var self = this;

        self.itemId = idPrefix + "-item-" + id;
        self.model = model;

        var _isVisible = true;

        //self.opacity = ko.observable(app_defaults.zero_opacity);

        self.isVisible = function() {
            return _isVisible;
        };

        self.show = function() {
            $("#" + self.itemId).removeClass(app_defaults.item_hidden_class).addClass(app_defaults.item_visible_class);
            _isVisible = true;
        };

        self.hide = function() {
            $("#" + self.itemId).removeClass(app_defaults.item_visible_class).addClass(app_defaults.item_hidden_class);
            _isVisible = false;
        };
    }

    /*
     * visible items range
     * @param {type} from
     * @param {type} to
     * @returns {_L10.ItemsRange}
     */
    function ItemsRange(from, to) {
        this.from = createObservable(from);
        this.to = createObservable(to);
    }

    /*
     * How many items on page
     * @param {type} items
     * @param {type} idPrefix
     * @returns {undefined}
     */
    function ItemsPage(items) {

        var self = this;

        self.availableItems = items;
        self.pageIndex = createObservable(1);
        self.visibleRange = new ItemsRange(0, items.length - 1);
        
        self.visibleItems = createComputed(function() {
            var r = self.availableItems.slice( self.visibleRange.from() );
            return r;
        }, self);
        

        self.showItems = function(pageId, startIndex, containerHeight) {
            var currentHeight = 0.0;
            var lastIndex = 0;
            
            self.pageIndex(pageId);
            self.visibleRange.from(startIndex);

            for (var ix = self.visibleRange.from(); ix < self.availableItems.length; ix++) {
                lastIndex = 0;
                var currentItem = self.availableItems[ix];
                
                function showCurrent(anItem) {
                    var itemHeight = $("#" + anItem.itemId).height();
                    currentHeight += itemHeight;
                    if (currentHeight < containerHeight) {
                        setTimeout(function() {
                            anItem.show();
                        }, 150);
                        self.visibleRange.to(ix);
                        return true;
                    } else {
                        console.log("item exceeds container height.");
                        if (!anItem.isVisible()) {
                            return false;
                        } else {
                            anItem.hide();
                        }
                    }
                }

                if (!showCurrent(currentItem)) {
                    lastIndex = ix - 1;
                    break;
                }
            }

            return lastIndex;
        };
    }

    function Page(startIndex) {
        
        var self = this;
        
        self.prevPage = null;
        self.nextPage = null;
        self.startIndex = startIndex;
        self.pageId = 1;
    }
    
    function PageList() {
        var self = this;
        
        self.head = new Page(0);
        self.tail = null;
        self.current = self.head;
        
        self.moveNext = function(startIndex) {
            if( self.current.nextPage  ) {
                self.current = self.current.nextPage;
                self.current.startIndex = startIndex;
            } else {
                var pg =  new Page( startIndex );
                
                pg.pageId = self.current.pageId + 1;
                pg.prevPage = self.current;
                self.current.nextPage = pg;
                self.current = pg;
            }
        };
        
        self.movePrev = function() {
          self.current = self.current.prevPage;  
        };
    }

    function DynamicPager(pageContainerId, collectionContainerId, items, collectionName) {

        var self = this;

        // var _collectionName = collectionName;
        var _pageContainerId = pageContainerId;
        var _collectionContainerId = collectionContainerId;
        var _pageList = new PageList();

        self.actualHeight = createObservable("100%");
        self.availableItems = [];
        
        if (items) {
            _.each(items, function(i) {
                self.availableItems.push(new ItemContainer(self.availableItems.length + 1, i, collectionName));
            });
        }
        
        self.currentPage = new ItemsPage(self.availableItems);

        self.itemsCount = createComputed(function() {
            var r = self.availableItems.length;
            return r;
        }, self);

        self.fromVisible = createComputed(function() {
            return self.currentPage.visibleRange.from() + 1;
        }, self);

        self.toVisible = createComputed(function() {
            return self.currentPage.visibleRange.to() + 1;
        }, self);

        console.log("current page loaded");

        /*
         self.actualHeight.subscribe(function(newValue) {
         console.log(newValue);
         });
         */

        function syncHeight() {
            var h = $(_pageContainerId).height();
            self.actualHeight(h + "px");

            return h;
        }
        ;

        /**
         * only for testing
         * @returns {undefined}
         */
        self.increaseBodySize = function() {
            var h = $('body').height();
            h += h * 0.10;
            $('body').height(h);
        };

        function onResize(e) {
            console.log(e);
            setTimeout(function() {
                syncHeight();
                self.show(app_defaults.show_hide_delay);
            }, app_defaults.resize_delay);
        }


        var lastScroll = 0;

        function onScroll(e) {
            console.log(e);
            var currentScroll = $(window).scrollTop();
            // is this 'scroll-down' ?
            if (currentScroll > lastScroll) {
                setTimeout(function() {
                    syncHeight();
                    self.show(app_defaults.show_hide_delay);
                }, app_defaults.resize_delay);
            }

            lastScroll = currentScroll;
        }
        ;

        $(document).ready(function() {

            $(window).resize(onResize);
            $(window).on('scroll', onScroll);

        });

        // window.document.body.onresize = self._onResize;
        var _lastShow = new Date();

        self.show = function(delay) {

            var actualDelay = delay || 0;

            var nowTime = new Date();
            var duration = nowTime - _lastShow;

            if (duration >= actualDelay) {
                setTimeout(function() {
                    self.currentPage.showItems( _pageList.current.pageId, 
                                                _pageList.current.startIndex, 
                                                $(_collectionContainerId).height() );
                }, actualDelay);

                _lastShow = nowTime;
            }
        };

        self.showNext = function() {
            console.log("<showNext>");
            _pageList.moveNext(self.currentPage.visibleRange.to() + 1);
            self.show(app_defaults.resize_delay);
        };

        self.showPrev = function() {
            console.log("<showPrev>");
            
            _pageList.movePrev();
            self.show(app_defaults.resize_delay);
        };

    }

    var module = {
        CollectionViewer: DynamicPager,
        Defaults: app_defaults
    };

    return module;

})(window, jQuery);

