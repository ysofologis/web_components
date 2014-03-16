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
        value: 0.75
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
        value: "100%"
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

    Array.prototype.clear = function() {
        while (this.length > 0) {
            this.pop();
        }
    };

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

        self.id = id - 1;
        self.itemId = idPrefix + "-item-" + id;
        self.model = model;
        self.desiredHeight = createObservable(app_defaults.item_container_height);
        self.actualHeight = createObservable("0px");

        var _defaultHeight = 0;
        var _isVisible = true;
        var _elem = null;
        var _loaded = false;

        function getElem() {
            if (!_elem || !_loaded) {
                _elem = $("#" + self.itemId);
                var h = _elem.height();
                if (h) {
                    _loaded = true;
                }
            }
            return _elem;
        }

        self.getInitialHeight = function() {
            if (_defaultHeight === 0) {
                _defaultHeight = getElem().height();
            }
            return _defaultHeight;
        }

        self.getIdealHeight = function() {

            if (self.desiredHeight() === app_defaults.item_container_height) {
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
            self.actualHeight(getElem().height() + "px");
            self.getInitialHeight();
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
            _elem.height(app_defaults.item_container_height);
        };

        self.setInitialHeight = function() {
            self.desiredHeight(_defaultHeight + "px");
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
    function ItemsRenderer(availableItems) {

        var self = this;

        self.pageIndex = createObservable(1);
        self.visibleRange = new ItemsRange(0, availableItems.length - 1);

        self.visibleItems = createObservableArray();

        self.nextStart = function() {
            var r = self.visibleRange.to() + 1;
            return r;
        };

        function PagedItemRenderer(page, containerHeight) {

            var me = this;
            var _currentHeight = 0;

            me.renderItem = function(anItem, ix) {

                var idealHeight = anItem.getIdealHeight();

                if (!idealHeight || idealHeight === 0) {
                    anItem.setAutoHeight();
                    idealHeight = anItem.getIdealHeight();
                }

                var itemHeight = 0;
                var remaining_height = 0;

                itemHeight = idealHeight + app_defaults.x_margin;
                remaining_height = containerHeight - _currentHeight;
                _currentHeight += itemHeight;

                if (_currentHeight < containerHeight) {
                    setTimeout(function() {
                        anItem.show();
                        anItem.setAutoHeight();
                    }, 150);
                    self.visibleRange.to(ix + 1);
                    page.endIndex = ix;
                    return true;
                } else {

                    var remaining_heigh_factor = (remaining_height / itemHeight);

                    if (remaining_heigh_factor >= app_defaults.x_shrink_factor) {
                        console.log(String.format("item [{0}] will be shrinked."), anItem.itemId);
                        anItem.setHeight(remaining_height - app_defaults.x_margin);
                        setTimeout(function() {
                            anItem.show();
                        }, 150);
                        self.visibleRange.to(ix + 1);
                        page.endIndex = ix;
                        return true;

                    }
                    else {
                        console.log(String.format("item [{0}] exceeds container height.", anItem.itemId));
                        if (!anItem.isVisible()) {
                            return false;
                        } else {
                            anItem.hide();
                        }
                    }
                }

            };
        }

        function clearVisibleItems() {
            while ( self.visibleItems().length > 0 ) {
                self.visibleItems().pop();
            }
        }

        function removeTail(itemId) {
            self.visibleItems.remove(function(item) {
                return item.id >= itemId;
            });
        }
        /*
         * Renders items for the current page starting from a given array slice index
         * @param {type} pageId
         * @param {type} startIndex
         * @param {type} containerHeight
         * @returns {Number}
         */
        self.renderPage = function(page, containerHeight, lastPage) {

            clearVisibleItems();

            var itemRenderer = new PagedItemRenderer(page, containerHeight);

            for (var ix = page.startIndex; ix < availableItems.length; ix++) {

                var currentIndex = ix;
                var currentItem = availableItems[currentIndex];

                currentItem.hide();
                self.visibleItems.push(currentItem);

                if (itemRenderer.renderItem(currentItem, currentIndex)) {
                    currentItem.show();
                } else {
                    currentItem.hide();
                    self.visibleItems.pop();
                    break;
                }
            }
        };

        self.resizePage = function(page, containerHeight) {

            var itemRenderer = new PagedItemRenderer(page, containerHeight);
            var allVisible = true;
            var lastVisible = -1;
            var currentLength = self.visibleItems().length;

            /*
             * check if existing items can be rendered
             * @type Number|@exp;self@pro;visibleItems@pro;length
             */
            for (var ix = 0; ix < currentLength; ix++) {

                var currentIndex = ix;
                var currentItem = self.visibleItems()[currentIndex];
                    
                lastVisible = ix;

                if (!itemRenderer.renderItem(currentItem, currentIndex)) {
                    removeTail(ix);
                    allVisible = false;
                    break;
                }
            }

            /*
             * remove all those left
             */
            if ( (lastVisible > 0) && (! allVisible ) )  {

                self.visibleItems.remove(function(item) {
                    if (item.id >= lastVisible) {
                        return true;
                    }
                });
            }

            /*
             * if there is available space add more
             */
            if (allVisible) {
                for (var ix = lastVisible + 1; ix < availableItems.length; ix++) {

                    var currentIndex = ix;
                    var currentItem = availableItems[currentIndex];

                    currentItem.hide();
                    self.visibleItems.push(currentItem);

                    if (itemRenderer.renderItem(currentItem, currentIndex)) {
                        currentItem.show();
                    } else {
                        currentItem.hide();
                        self.visibleItems.pop();
                        break;
                    }

                }
            }
        };
    }
    /*
     * 
     * @param {type} startIndex
     * @returns {undefined}
     */
    function Page(startIndex) {

        var self = this;

        self.startIndex = startIndex;
        self.endIndex = 0;
        self.pageId = 1;
    }
    /*
     * Page navigation
     * @returns {undefined}
     */
    function PageNavigation() {
        var self = this;

        var _pageList = [];
        var _ix = 0;

        _pageList.push(new Page(0));

        self.getCurrent = function() {
            return _pageList[_ix];
        };

        self.moveNext = function(startIndex) {
            if (self.canMoveNext()) {
                _ix++;
                _pageList[_ix].startIndex = startIndex;
            } else {
                var pg = new Page(startIndex);

                pg.pageId = self.getCurrent().pageId + 1;
                _pageList.push(pg);
                _ix++;
            }
        };

        self.canMoveNext = function() {
            return (_ix < (_pageList.length - 1));
        };

        self.movePrev = function() {
            _ix--;
            _pageList[_ix].endIndex = _pageList[_ix + 1].startIndex - 1;
        };

        self.canMovePrev = function() {
            return (_ix > 0);
        };
    }

    function DynamicPager(pageContainerId, collectionContainerId, items, collectionName) {

        var self = this;

        // var _collectionName = collectionName;
        var _pageContainerId = pageContainerId;
        var _collectionContainerId = collectionContainerId;
        var _pageNav = new PageNavigation();

        var _collectionElemt = $(_collectionContainerId);

        self.actualHeight = createObservable("100%");
        self.availableItems = [];

        if (items) {
            _.each(items, function(i) {
                self.availableItems.push(new ItemContainer(self.availableItems.length + 1, i, collectionName));
            });
        }

        self.renderer = new ItemsRenderer(self.availableItems);

        self.itemsCount = createComputed(function() {
            var r = self.availableItems.length;
            return r;
        }, self);

        self.fromVisible = createComputed(function() {
            return self.renderer.visibleRange.from() + 1;
        }, self);

        self.toVisible = createComputed(function() {
            return self.renderer.visibleRange.to() + 1;
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

        $(document).ready(function() {

            $(window).resize(onResize);
            $(window).on('scroll', onScroll);

        });


        var _lastResize = new Date();

        /*
         * called by 'resize' events
         * @param {type} delay
         * @returns {undefined}
         */
        function _resizePage(delay) {

            var actualDelay = delay || 0;

            var nowTime = new Date();
            var duration = nowTime - _lastResize;

            if (duration >= actualDelay) {
                setTimeout(function() {
                    self.renderer.resizePage(_pageNav.getCurrent(), _collectionElemt.height());
                }, actualDelay);

                _lastResize = nowTime;
            }
        }
        ;

        function onResize(e) {
            console.log(e);
            setTimeout(function() {
                syncHeight();
                _resizePage(app_defaults.show_hide_delay);
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
                    _resizePage(app_defaults.show_hide_delay);
                }, app_defaults.resize_delay);
            }

            lastScroll = currentScroll;
        }


        self.show = function(delay) {

            var actualDelay = delay || 0;

            setTimeout(function() {
                self.renderer.renderPage(_pageNav.getCurrent(), _collectionElemt.height());
            }, actualDelay);
        };

        /*
         * Renders a complete page
         * @param {type} currentPage
         * @param {type} lastPage
         * @returns {undefined}
         */
        function _renderPage(currentPage, lastPage) {

            self.renderer.renderPage(currentPage, _collectionElemt.height(), lastPage);
        }
        ;
        /*
         * navigate to next page
         */
        self.showNext = function() {
            console.log("<showNext>");

            var lastPage = _pageNav.getCurrent();
            _pageNav.moveNext(self.renderer.nextStart());
            _renderPage(_pageNav.getCurrent(), lastPage);
        };
        /*
         * can navigate to next ?
         */
        self.hasNext = createComputed(function() {
            var r = self.renderer.visibleRange.to() < (self.availableItems.length - 1);
            return r;

        }, self);
        /*
         * navigate to previous page
         */
        self.showPrev = function() {
            console.log("<showPrev>");

            var lastPage = _pageNav.getCurrent();
            _pageNav.movePrev();
            _renderPage(_pageNav.getCurrent(), lastPage);
        };
        /*
         * can navigate to previous ?
         */
        self.hasPrev = createComputed(function() {
            var r = self.renderer.visibleRange.from() > 0;

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

