/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var mylib = mylib || {};
mylib.utils = mylib.utils || {};

mylib.utils.collections = (function (window, $) {

    var app_defaults = {};

    Object.defineProperty(app_defaults, "collection_view_template", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: "collection-view-template"
    });

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

    Object.defineProperty(app_defaults, "x_shrink_min_height", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: 150,
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
        String.format = function (format) {
            var args = Array.prototype.slice.call(arguments, 1);
            return format.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] !== 'undefined'
                        ? args[number]
                        : match
                ;
            });
        };
    }

    Array.prototype.clear = function () {
        while (this.length > 0) {
            this.pop();
        }
    };

    function createUUID() {
        // http://www.ietf.org/rfc/rfc4122.txt
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
    }

    function createObservable(initialValue) {
        if (typeof initialValue != 'undefined') {
            return initialValue;
        } else {
            return null;
        }
    }

    function createObservableArray(initialData) {
        return createObservable(initialData);
    }

    function BoundField(selector, val) {
        var self = this;
        var _elem = $(selector);

        self.get = function () {
            var r = _elem.val();
            return r;
        };

        self.set = function (newVal) {
            _elem.text(newVal);
            return self;
        };

        if (typeof val != "undefined") {
            self.set(val);
        }
    };

    function ComputedBoundField(selector, func) {
        var self = this;

        var _field = new BoundField(selector);
        var _func = func;

        self.update = function () {
            var r = _func();
            _field.set(r);

            return self;
        }
    }

    function AttributeBoundField(selector, attr, val) {
        var self = this;
        var _elem = $(selector);
        var _attr = attr;

        self.get = function () {
            var r = _elem.css(_attr);
            return r;
        };

        self.set = function (v) {
            _elem.css(_attr, v);
            return self;
        };

        if (typeof val != "undefined") {
            self.set(val);
        }

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

        self.id = id;
        self.itemId = idPrefix + "-item-" + id;
        self.listItemId = String.format("{0}-container", self.itemId);
        self.model = model;

        var _defaultHeight = 0;
        var _isVisible = true;
        var _elem = null;
        var _containerElem = null;
        var _loaded = false;
        var _disposed = false;

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

        function getContainerElem() {
            if (!_containerElem) {
                _containerElem = $("#" + self.listItemId);
            }
            return _containerElem;
        }

        self.isVisible = function () {
            return _isVisible;
        };

        self.show = function () {
            getElem().removeClass(app_defaults.item_hidden_class).addClass(app_defaults.item_visible_class);
            _isVisible = true;
        };

        self.hide = function () {
            getElem().removeClass(app_defaults.item_visible_class).addClass(app_defaults.item_hidden_class);
            _isVisible = false;
        };

        self.dispose = function () {
            if (!_disposed) {
                _isVisible = null;
                _elem = null;
                self.model = null;
                $("#" + self.listItemId).remove();
                _disposed = true;
            }
        };

        self.getHeight = function () {
            var h = getContainerElem().height();
            return h;
        };

        self.setHeight = function (newHeight) {
            var h = getContainerElem().height();

            if (_defaultHeight === 0) {
                _defaultHeight = h;
            }

            getContainerElem().height(newHeight);
        };
    }

    /*
     * visible items range
     * @param {type} from
     * @param {type} to
     * @returns {_L10.ItemsRange}
     */
    function ItemsRange(collectionContainerId, from, to) {

        var self = this;

        self.from = new BoundField(collectionContainerId + " .paging .visible-from");
        self.from.set(from);
        self.to = new BoundField(collectionContainerId + " .paging .visible-to");
        self.to.set(to);
    }


    function VisibleItems() {
        var self = this;

        self.map = {};

        self.size = function () {
            return Object.keys(self.map).length;
        };

        self.exists = function (itemId) {
            var r = self.map.hasOwnProperty(itemId)
            return r;
        };

        self.get = function (itemId) {
            if (self.exists(itemId)) {
                return self.map[itemId];
            } else {
                return null;
            }
        };

        self.getById = function (id) {
            for (var itemId in self.map) {
                if (self.map[itemId].id == id) {
                    return self.map[itemId];
                }
            }
            return null;
        };

        self.set = function (anItem) {
            self.map[anItem.itemId] = anItem;
        };

        self.clear = function () {
            for (var k in self.map) {
                self.map[k].dispose();
            }
            self.map = {};
        };

        self.remove = function (compare_func) {
            for (var itemId in self.map) {
                if (compare_func(itemId)) {
                    var item = self.map[itemId];
                    item.dispose();
                    delete self.map[itemId];
                }
            }
        };
    }
    /*
     * How many items on page
     * @param {type} items
     * @param {type} idPrefix
     * @returns {undefined}
     */
    function ItemsRenderer(collectionContainerId, dataSource, itemTemplate, collectionName) {

        var self = this;

        self.pageIndex = new BoundField(collectionContainerId + " .paging .page-index", 0);
        self.visibleRange = new ItemsRange(collectionContainerId, 0, 0);

        dataSource.fetch(function () {
            self.visibleRange.to.set(dataSource.total());
        });

        var _ul = $(collectionContainerId + " .collection-view .list-container");

        // self.visibleItems = new kendo.data.ObservableArray([]);
        self.visibleItems = new VisibleItems();

        self.nextStart = function () {
            var r = self.visibleRange.to.get() + 1;
            return r;
        };

        function PagedItemRenderer(page, containerHeight) {

            var me = this;
            var _currentHeight = 0;

            function renderModel(item) {

                var containerHtml = String.format("<li id='{0}'><div id='{1}' class='item-container'></div></li>", item.listItemId, item.itemId);
                _ul.append(containerHtml);

                var modelView = new kendo.View(itemTemplate, { model: item.model });
                modelView.render($("#" + item.itemId));
            }

            me.tryRenderItem = function (anItem, alreadyLoaded) {

                if (!alreadyLoaded) {
                    renderModel(anItem);
                } else {
                    anItem.setHeight("auto");
                }

                var actualHeight = anItem.getHeight();

                var itemHeight = 0;
                var remaining_height = 0;

                itemHeight = actualHeight + app_defaults.x_margin;
                remaining_height = containerHeight - _currentHeight;
                _currentHeight += itemHeight;

                if (_currentHeight < containerHeight) {
                    return true;
                } else {

                    // var remaining_heigh_factor = (remaining_height / itemHeight);

                    if (remaining_height >= app_defaults.x_shrink_min_height) {
                        console.log(String.format("item [{0}] will be shrinked."), anItem.itemId);
                        anItem.setHeight(remaining_height - app_defaults.x_margin);
                        return true;
                    }
                    else {
                        console.log(String.format("item [{0}] exceeds container height.", anItem.itemId));
                        return false;
                    }
                }

            };
        }


        function getNext(dataSource, ix) {
            // TODO: get current item through paging
            return new kendo.observable(dataSource.at(ix));
        }
        /*
         * Renders items for the current page starting from a given array slice index
         * @param {type} pageId
         * @param {type} startIndex
         * @param {type} containerHeight
         * @returns {Number}
         */
        function tryRenderPage(page, containerHeight, lastPage, updatePagingCounters, renderingCompleted) {

            if (lastPage) {
                self.visibleItems.clear();
            }

            var itemRenderer = new PagedItemRenderer(page, containerHeight);

            var ix = page.startIndex;

            while (ix < dataSource.total()) {
                var currentItem = getNext(dataSource, ix);

                if (!currentItem) {
                    break;
                }

                var itemContainer = self.visibleItems.getById(ix);
                var alreadyLoaded = false;

                if (!itemContainer) {
                    itemContainer = new ItemContainer(ix, currentItem, collectionName);
                } else {
                    alreadyLoaded = true;
                }

                if (itemRenderer.tryRenderItem(itemContainer, alreadyLoaded)) {
                    setTimeout(function () {
                        itemContainer.show();
                    }, 150);
                    self.visibleRange.to.set(ix + 1);
                    page.endIndex = ix;
                    updatePagingCounters();
                    self.visibleItems.set(itemContainer);
                } else {
                    self.visibleItems.remove(function (i) {
                        return i === itemContainer.itemId;
                    });
                    itemContainer.dispose();
                    break;
                }

                ix++;
            }

            if (renderingCompleted) {
                renderingCompleted();
            }
        };

        self.renderPage = function (page, containerHeight, lastPage, updatePagingCounters, renderingCompleted) {
            tryRenderPage(page, containerHeight, lastPage, updatePagingCounters, renderingCompleted);
        };

        self.resizePage = function (page, containerHeight, updatePagingCounters, renderingCompleted) {
            tryRenderPage(page, containerHeight, null, updatePagingCounters, renderingCompleted);
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

        self.getCurrent = function () {
            return _pageList[_ix];
        };

        self.moveNext = function (startIndex) {
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

        self.canMoveNext = function () {
            return (_ix < (_pageList.length - 1));
        };

        self.movePrev = function () {
            _ix--;
            _pageList[_ix].endIndex = _pageList[_ix + 1].startIndex - 1;
        };

        self.canMovePrev = function () {
            return (_ix > 0);
        };

        self.reset = function () {
            _pageList = [];
            _ix = 0;

            _pageList.push(new Page(0));
        };
    }

    /*
    Dynamic Pager
    */
    function DynamicPager(pageContainerId, collectionContainerId, itemTemplate, dataSource, collectionName) {

        var self = this;

        // var _collectionName = collectionName;
        var _pageContainerId = pageContainerId;
        var _pageNav = new PageNavigation();
        var _dataSource = dataSource;

        var _collectionView = new kendo.View(app_defaults.collection_view_template, { model: null });
        _collectionView.render($(collectionContainerId));

        var _collectionElem = $(collectionContainerId);
        var _listElem = $(collectionContainerId + " .collection-view .list-container");
        var _btnNext = $(collectionContainerId + " .collection-view .paging .show-next");
        var _btnPrev = $(collectionContainerId + " .collection-view .paging .show-prev");

        self.renderer = new ItemsRenderer(collectionContainerId, _dataSource, itemTemplate, collectionName);

        self.itemsCount = new ComputedBoundField(collectionContainerId + " .paging .items-count", function () {
            var r = _dataSource.total();
            return r;
        }).update();

        self.fromVisible = new ComputedBoundField(collectionContainerId + " .paging .visible-from", function () {
            return self.renderer.visibleRange.from.get() + 1;
        }).update();

        self.toVisible = new ComputedBoundField(collectionContainerId + " .paging .visible-to", function () {
            return self.renderer.visibleRange.to.get() + 1;
        }).update();

        console.log("current page loaded");


        function updatePagingCounters() {
            self.itemsCount.update();
            self.fromVisible.update();
            self.toVisible.update();
        }

        function pageRenderingCompleted() {
            _btnPrev.attr("disabled", "disabled");
            _btnNext.attr("disabled", "disabled");

            var pg = _pageNav.getCurrent();

            var totalItems = dataSource.total();

            if (pg.endIndex < (totalItems-1)) {
                _btnNext.removeAttr("disabled");
            }

            if (pg.pageId > 1) {
                _btnPrev.removeAttr("disabled");
            }
        }


        /*
         self.actualHeight.subscribe(function(newValue) {
         console.log(newValue);
         });
         */

        function syncHeight() {
            var h = $(_pageContainerId).height();
            _collectionElem.height(h);
            return h;
        }

        /**
         * only for testing
         * @returns {undefined}
         */
        self.increaseBodySize = function () {
            var h = $('body').height();
            h += h * 0.10;
            $('body').height(h);
        };

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
                setTimeout(function () {
                    self.renderer.resizePage(_pageNav.getCurrent(), getListHeight(), updatePagingCounters, pageRenderingCompleted);
                }, actualDelay);

                _lastResize = nowTime;
            }
        }
        ;

        function onResize(e) {
            console.log(e);
            setTimeout(function () {
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
                setTimeout(function () {
                    syncHeight();
                    _resizePage(app_defaults.show_hide_delay);
                }, app_defaults.resize_delay);
            }

            lastScroll = currentScroll;
        }

        function getListHeight() {
            var r = _listElem.height();
            return r;
        }

        self.show = function (delay) {
            var actualDelay = delay || 0;
            _pageNav.reset();

            _btnPrev.attr("disabled", "disabled");
            _btnNext.attr("disabled", "disabled");

            setTimeout(function () {
                self.renderer.renderPage(_pageNav.getCurrent(), getListHeight(), null, updatePagingCounters, pageRenderingCompleted);
            }, actualDelay);
        };

        /*
         * Renders a complete page
         * @param {type} currentPage
         * @param {type} lastPage
         * @returns {undefined}
         */
        function _renderPage(currentPage, lastPage) {
            self.renderer.renderPage(currentPage, getListHeight(), lastPage, updatePagingCounters, pageRenderingCompleted);
        }
        /*
         * navigate to next page
         */
        function showNext() {
            console.log("<showNext>");

            var lastPage = _pageNav.getCurrent();
            _pageNav.moveNext(lastPage.endIndex + 1);
            _renderPage(_pageNav.getCurrent(), lastPage);
        };
        /*
         * navigate to previous page
         */
        function showPrev() {
            console.log("<showPrev>");

            var lastPage = _pageNav.getCurrent();
            _pageNav.movePrev();
            _renderPage(_pageNav.getCurrent(), lastPage);
        };

        /* event handler binding */
        $(document).ready(function () {

            $(window).resize(onResize);
            $(window).on('scroll', onScroll);

            _btnNext.click(function () {
                showNext();
            });

            _btnPrev.click(function () {
                showPrev();
            });
        });
    }

    /*
     * what my module exports to outside world
     */

    var module = {
        createCollectionViewer: function (pageContainerId, collectionContainerId, itemTemplate, dataSource) {
            var collectionName = "my_collection_" + createUUID();
            return new DynamicPager(pageContainerId, collectionContainerId, itemTemplate, dataSource, collectionName);
        },
        defaults: app_defaults
    };

    return module;

})(window, jQuery);

