/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var relational = relational || {};
relational.widgets = relational.widgets || {};

relational.widgets.collectionviewer = (function (window, $) {

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
        value: 15
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
        value: 100,
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

    Object.defineProperty(app_defaults, "item_shrunk_class", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: "shrunk"
    });

    Object.defineProperty(app_defaults, "item_container_height", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: "100%"
    });

    Object.defineProperty(app_defaults, "item_container_show_delay", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: 150
    });

    Object.defineProperty(app_defaults, "item_container_dispose_delay", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: 750
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

    function BoundField(selector, val) {
        var self = this;
        var _elem = $(selector);

        self.get = function () {
            var r = _elem.text();
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
        var _shrunk = false;

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
            getElem().addClass(app_defaults.item_visible_class).removeClass(app_defaults.item_hidden_class).removeClass(app_defaults.item_shrunk_class);
            // 1000, "easeOutBounce"
            if (_shrunk) {
                getElem().addClass(app_defaults.item_shrunk_class);
                _shrunk = false;
            } 
            _isVisible = true;
        };

        self.hide = function (callback) {
            getElem().addClass(app_defaults.item_hidden_class).removeClass(app_defaults.item_visible_class);
            _isVisible = false;
        };

        self.dispose = function () {
            if (!_disposed) {
                _elem = null;
                if (_isVisible) {
                    self.hide();
                    self.model = null;
                    $("#" + self.listItemId).remove();
                }
                _disposed = true;
            }
        };

        self.getHeight = function () {
            var h = getContainerElem().height();
            return h;
        };

        self.setHeight = function (newHeight, shrunk) {
            var h = getContainerElem().height();

            if (_defaultHeight === 0) {
                _defaultHeight = h;
            }

            getContainerElem().height(newHeight);

            if (shrunk) {
                _shrunk = true;
            } else {
                _shrunk = false;
            }
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

        var _ul = null;

        // self.visibleItems = new kendo.data.ObservableArray([]);
        self.visibleItems = new VisibleItems();

        self.wrapElements = function () {
            _ul = $(collectionContainerId + " .collection-view .list-container");
        };

        self.nextStart = function () {
            var r = self.visibleRange.to.get() + 1;
            return r;
        };

        function PagedItemRenderer(page, containerHeight) {

            var me = this;
            var _currentHeight = 0;

            function renderModel(item) {
                var seeMoreText = "More ...";
                var seeMoreHtml = String.format("<div class='pull-right see-more-link'><a href='javascript:void(0)'>{0}</a></div>", seeMoreText);
                var containerHtml = String.format("<li id='{0}'><div id='{1}' class='item-container {2}'><div class='item-placeholder'></div>{3}</div></li>", item.listItemId, item.itemId, app_defaults.item_hidden_class, seeMoreHtml);
                _ul.append(containerHtml);

                var modelView = new kendo.View(itemTemplate, { model: item.model });
                modelView.render($("#" + item.itemId + " .item-placeholder"));

                // $("#" + item.listItemId).append(seeMoreHtml);

                var liText = $("#" + item.listItemId).html();
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
                        anItem.setHeight(remaining_height - app_defaults.x_margin, true);
                        return true;
                    }
                    else {
                        console.log(String.format("item [{0}] exceeds container height.", anItem.itemId));
                        return false;
                    }
                }

            };
        }


        function getNext(dataSource, ix, callback) {

            var currentIndex = ix;
            var currentModel = null;
            var dataLen = dataSource.total();

            if (ix < dataLen) {
                var dataView = dataSource.view();

                if (ix < dataView.length) {
                    var item = dataView[ix];
                    currentModel = item;

                    if (!(currentModel instanceof kendo.observable)) {
                        currentModel = new kendo.observable(item);
                    }

                    callback(currentIndex, currentModel);

                } else {

                    var dataPageSize = dataSource.pageSize;
                    var dataPage = dataLen / dataPageSize;

                    dataSource.query({ page: dataPage, pageSize: dataPageSize }, function () {

                        var dataView = dataSource.view();

                        if (ix < dataView.length) {
                            var item = dataView[ix];
                            currentModel = item;

                            if (!(currentModel instanceof kendo.observable)) {
                                currentModel = new kendo.observable(item);
                            }

                            callback(currentIndex, currentModel);
                        }

                    });
                }
            }
            else {
                callback(currentIndex, currentModel);
            }
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
            var shouldContinue = true;
            var dataLen = dataSource.total();

            while (ix < dataLen) {

                // 1. Async fetching depends on data source content
                // 2. isolate current index inside callback to avoid invalid index value
                getNext(dataSource, ix, function (currentIndex, currentModel) {

                    if (!shouldContinue) {
                        return;
                    }

                    if (!currentModel) {
                        shouldContinue = false;

                        if (renderingCompleted) {
                            renderingCompleted();
                        }

                        return;
                    }

                    var itemContainer = self.visibleItems.getById(currentIndex);
                    var alreadyLoaded = false;

                    if (!itemContainer) {
                        itemContainer = new ItemContainer(currentIndex, currentModel, collectionName);
                    } else {
                        alreadyLoaded = true;
                    }

                    if (itemRenderer.tryRenderItem(itemContainer, alreadyLoaded)) {
                        itemContainer.show();
                        self.visibleRange.to.set(currentIndex + 1);
                        page.endIndex = currentIndex;
                        updatePagingCounters();
                        self.visibleItems.set(itemContainer);
                    } else {
                        self.visibleItems.remove(function (i) {
                            return i === itemContainer.itemId;
                        });
                        itemContainer.dispose();
                        shouldContinue = false;

                        if (renderingCompleted) {
                            renderingCompleted();
                        }

                    }
                });

                if (!shouldContinue) {
                    break;
                }

                ix++;
            }

            if (ix == dataLen) {
                if (renderingCompleted) {
                    renderingCompleted();
                }
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


    function includeScript(scriptId, scriptPath, callback) {
        var scriptType = type = "text/x-kendo-layout";
        var script = document.getElementById(scriptId);
        if (!script) {

            $.get(scriptPath).success(function (newhtml) {
                    var script = document.createElement('script');
                    script.type = scriptType;
                    script.id = scriptId;
                    script.text = newhtml;
                    document.body.appendChild(script);
                    callback();
                } );

        } else {
            callback();
        }
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

        var _collectionView = null;

        var _collectionElem = null;
        var _listElem = null;
        var _btnNext = null;
        var _btnPrev = null;

        var _viewLoaded = false;
        var _autoLoad = false;

        function initView() {
            _collectionView = new kendo.View(app_defaults.collection_view_template, { model: null });
            _collectionView.render($(collectionContainerId));

            _collectionElem = $(collectionContainerId);
            _listElem = $(collectionContainerId + " .collection-view .list-container");
            _btnNext = $(collectionContainerId + " .collection-view .paging .show-next");
            _btnPrev = $(collectionContainerId + " .collection-view .paging .show-prev");

            self.renderer.wrapElements();

        };

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

            if (pg.endIndex < (totalItems - 1)) {
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

        function showView(delay) {
            var actualDelay = delay || 0;
            _pageNav.reset();

            _btnPrev.attr("disabled", "disabled");
            _btnNext.attr("disabled", "disabled");

            setTimeout(function () {
                self.renderer.renderPage(_pageNav.getCurrent(), getListHeight(), null, updatePagingCounters, pageRenderingCompleted);
            }, actualDelay);

        }

        self.show = function (delay) {
            if (_viewLoaded) {
                showView(delay);
            } else {
                _autoLoad = true;
            }
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

            includeScript(app_defaults.collection_view_template, "templates/collection-view.html", function () {
                initView();

                $(window).resize(onResize);
                $(window).on('scroll', onScroll);

                _btnNext.click(function () {
                    showNext();
                });

                _btnPrev.click(function () {
                    showPrev();
                });

                if (_autoLoad) {
                    showView();
                }

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

