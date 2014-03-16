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

    Object.defineProperty(app_defaults, "x_margin", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: 10
    });

    Object.defineProperty(app_defaults, "x_shrink_factor", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: 0.50
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

    Object.defineProperty(app_defaults, "item_container_height", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: "auto"
    });

    if (!String.format) {
        String.format = function(format) {
            var args = Array.prototype.slice.call(arguments, 1);
            return format.replace(/{(\d+)}/g, function(match, number) {
                return typeof args[number] !== 'undefined'
                        ? args[number]
                        : match
                        ;
            });
        };
    }

    function createObservable(initialValue) {
        return ko.observable(initialValue);
    }

    function createObservableArray(initialData) {
        return ko.observableArray(initialData);
    }

    function createComputed(func, binder) {
        return ko.computed(func, binder);
    }

    /*
     * Contains an item from the input array
     * @param {type} id
     * @param {type} model
     * @param {type} idPrefix
     * @returns {undefined}
     */
    function ItemContainer(id, model, idPrefix) {
        var self = this;

        self.itemId = idPrefix + "-item-" + id;
        self.model = model;
        self.desiredHeight = createObservable(app_defaults.item_container_height);

        var _defaultHeight = 0;
        var _isVisible = true;

        function getElem() {
            var e = $("#" + self.itemId);
            return e;
        }

        self.getInitialHeight = function() {
            if (_defaultHeight === 0) {
                _defaultHeight = getElem().height();
            }
            return _defaultHeight;
        }
        
        self.getIdealHeight = function() {
          
            if ( self.desiredHeight() === app_defaults.item_container_height ) {
                
                var h = getElem().height();
                
                return h;
            } else {
                return self.getInitialHeight();
            }
            
        };

        self.isVisible = function() {
            return _isVisible;
        };

        self.show = function() {
            getElem().removeClass(app_defaults.item_hidden_class).addClass(app_defaults.item_visible_class);
            _isVisible = true;
        };

        self.hide = function() {
            getElem().removeClass(app_defaults.item_visible_class).addClass(app_defaults.item_hidden_class);
            _isVisible = false;
        };

        self.setHeight = function(newHeight) {
            var h = getElem().height();

            if (_defaultHeight === 0) {
                _defaultHeight = h;
            }

            self.desiredHeight(newHeight + "px");
        };

        self.resetHeight = function() {
            if (_defaultHeight > 0) {
                self.desiredHeight(_defaultHeight + "px");
            }
        };
        
        self.setAutoHeight = function() {
           
            self.desiredHeight(app_defaults.item_container_height);
            
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
            var r = self.availableItems.slice(self.visibleRange.from());
            return r;
        }, self);

        self.nextStart = function() {
            return self.visibleRange.to() + 1;
        };
        /*
         * Renders items for the current page starting from a given array slice index
         * @param {type} pageId
         * @param {type} startIndex
         * @param {type} containerHeight
         * @returns {Number}
         */
        self.showItems = function(pageId, startIndex, containerHeight) {
            var currentHeight = 0.0;
            var lastIndex = 0;

            self.pageIndex(pageId);
            self.visibleRange.from(startIndex);

            for (var ix = self.visibleRange.from(); ix < self.availableItems.length; ix++) {
                lastIndex = 0;
                var currentItem = self.availableItems[ix];

                function showCurrent(anItem) {
                    
                    var itemHeight = anItem.getIdealHeight() + app_defaults.x_margin;
                    var remaining_height = containerHeight - currentHeight;
                    currentHeight += itemHeight;

                    if (currentHeight < containerHeight) {
                        anItem.setAutoHeight();
                        setTimeout(function() {
                            anItem.show();
                        }, 150);
                        self.visibleRange.to(ix);
                        return true;
                    } else {

                        var remaining_heigh_factor = (remaining_height / itemHeight);

                        if (remaining_heigh_factor >= app_defaults.x_shrink_factor) {
                            console.log( String.format("item [{0}] will be shrinked."), anItem.itemId );
                            anItem.setHeight(remaining_height - app_defaults.x_margin);
                            setTimeout(function() {
                                anItem.show();
                            }, 150);
                            self.visibleRange.to(ix);
                            return true;

                        }
                        else {
                            console.log( String.format("item [{0}] exceeds container height.", anItem.itemId ));
                            if (!anItem.isVisible()) {
                                return false;
                            } else {
                                anItem.hide();
                            }
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
    /*
     * 
     * @param {type} startIndex
     * @returns {undefined}
     */
    function Page(startIndex) {

        var self = this;

        self.prevPage = null;
        self.nextPage = null;
        self.startIndex = startIndex;
        self.pageId = 1;
    }
    /*
     * Page navigation
     * @returns {undefined}
     */
    function PageNavigation() {
        var self = this;

        self.head = new Page(0);
        self.tail = null;
        self.current = self.head;

        self.moveNext = function(startIndex) {
            if (self.current.nextPage) {
                self.current = self.current.nextPage;
                self.current.startIndex = startIndex;
            } else {
                var pg = new Page(startIndex);

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
        var _pageNav = new PageNavigation();

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
                    self.currentPage.showItems(_pageNav.current.pageId,
                            _pageNav.current.startIndex,
                            $(_collectionContainerId).height());
                }, actualDelay);

                _lastShow = nowTime;
            }
        };
        /*
         * navigate to next page
         */
        self.showNext = function() {
            console.log("<showNext>");
            _pageNav.moveNext(self.currentPage.nextStart());
            self.show(app_defaults.resize_delay);
        };
        /*
         * can navigate to next ?
         */
        self.hasNext = createComputed(function() {
            var r = self.currentPage.visibleRange.to() < (self.availableItems.length - 1);
            return r;

        }, self);
        /*
         * navigate to previous page
         */
        self.showPrev = function() {
            console.log("<showPrev>");

            _pageNav.movePrev();
            self.show(app_defaults.resize_delay);
        };
        /*
         * can navigate to previous ?
         */
        self.hasPrev = createComputed(function() {
            var r = self.currentPage.visibleRange.from() > 0;
            return r;
        }, self);
    }

    /*
     * what my module exports to outside world
     */

    var module = {
        CollectionViewer: DynamicPager,
        Defaults: app_defaults
    };

    return module;

})(window, jQuery);

