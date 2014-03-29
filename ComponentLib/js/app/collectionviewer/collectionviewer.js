/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 *
 * DEPENDENCIES: jquery, kendo.web, spiner.js
 */

define(["underscore", "jquery", "kendo", "spin",
    "text!templates/collection-view.html",
    "bootstrap", "jquery.slimscroll"],
        function(_, $, kendo, Spinner, viewTemplate) {

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

            Object.defineProperty(app_defaults, "min_viewer_height", {
                enumerable: false,
                configurable: false,
                writable: false,
                value: 400
            });


            var utils = {
                spinner_opts: {
                    lines: 13, // The number of lines to draw
                    length: 5, // The length of each line
                    width: 2, // The line thickness
                    radius: 6, // The radius of the inner circle
                    corners: 1, // Corner roundness (0..1)
                    rotate: 0, // The rotation offset
                    direction: 1, // 1: clockwise, -1: counterclockwise
                    color: '#000', // #rgb or #rrggbb or array of colors
                    speed: 1, // Rounds per second
                    trail: 60, // Afterglow percentage
                    shadow: false, // Whether to render a shadow
                    hwaccel: false, // Whether to use hardware acceleration
                    className: 'spinner', // The CSS class to assign to the spinner
                    zIndex: 2e9, // The z-index (defaults to 2000000000)
                    top: 'auto', // Top position relative to parent in px
                    left: 'auto' // Left position relative to parent in px
                },
                spinner: null,
                showSpinner: function(containerId) {
                    if (!this.spinner) {
                        this.spinner = new Spinner(this.spinner_opts);
                    }
                    var spinnerContainer = $(containerId)[0];
                    this.spinner.spin(spinnerContainer);
                },
                hideSpinner: function(containerId) {
                    if (this.spinner) {
                        this.spinner.stop();
                    }
                },
            };

            var default_config = {
                seeMorePlacement: 'left'
            };

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

            function isUndefined(v) {
                return typeof v == "undefined";
            }

            function setOrDefault(val, defaultVal) {
                if (isUndefined(val)) {
                    return defaultVal;
                } else {
                    return val;
                }
            }

            function merge(left, right) {
                var result = {};

                if (left) {
                    for (var attrname in left) {
                        result[attrname] = left[attrname];
                    }
                }
                if (right) {
                    for (var attrname in right) {
                        result[attrname] = right[attrname];
                    }
                }

                return result;
            }

            function BoundField(selector, val) {
                var self = this;
                var _elem = $(selector);
                var _val = setOrDefault(val, "");

                if (_val) {
                    _elem.text(_val);
                }

                self.get = function() {
                    _val = _elem.text();
                    return _val;
                };

                self.set = function(newVal) {
                    _val = setOrDefault(newVal, "");
                    _elem.text(_val);
                    return self;
                };
            }
            ;

            function ComputedBoundField(selector, func) {
                var self = this;

                var _field = new BoundField(selector);
                var _func = func;

                self.update = function() {
                    var r = _func();
                    _field.set(r);
                    return self;
                }
            }

            function AttributeBoundField(selector, attr, val) {
                var self = this;
                var _elem = $(selector);
                var _attr = attr;

                self.get = function() {
                    var r = _elem.css(_attr);
                    return r;
                };

                self.set = function(v) {
                    _elem.css(_attr, v);
                    return self;
                };

                if (typeof val != "undefined") {
                    self.set(val);
                }

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

                self.size = function() {
                    return Object.keys(self.map).length;
                };

                self.exists = function(itemId) {
                    var r = self.map.hasOwnProperty(itemId)
                    return r;
                };

                self.get = function(itemId) {
                    if (self.exists(itemId)) {
                        return self.map[itemId];
                    } else {
                        return null;
                    }
                };

                self.getById = function(id) {
                    for (var itemId in self.map) {
                        if (self.map[itemId].id == id) {
                            return self.map[itemId];
                        }
                    }
                    return null;
                };

                self.set = function(anItem) {
                    self.map[anItem.itemId] = anItem;
                };

                self.clear = function() {
                    for (var k in self.map) {
                        self.map[k].dispose();
                    }
                    self.map = {};
                };

                self.remove = function(compare_func) {
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
            function ItemsRenderer(collectionContainerId, collectionName, config) {

                var self = this;

                self.pageIndex = new BoundField(collectionContainerId + " .paging .page-index", 0);
                self.visibleRange = new ItemsRange(collectionContainerId, 0, 0);

                var _config = config;
                var _ul = null;
                var _itemTemplate = null;
                var _dataSource = null;

                // self.visibleItems = new kendo.data.ObservableArray([]);
                self.visibleItems = new VisibleItems();

                self.wrapElements = function() {
                    _ul = $(collectionContainerId + " .collection-view .list-container");
                };

                self.setDataSource = function(dataSource, itemTemplate) {
                    _dataSource = dataSource;
                    _itemTemplate = itemTemplate;

                    if (_dataSource) {
                        _dataSource.fetch(function() {
                            self.visibleRange.to.set(dataSource.total());
                        });
                    }

                };

                self.nextStart = function() {
                    var r = self.visibleRange.to.get() + 1;
                    return r;
                };

                self.dispose = function() {
                    self.visibleItems.clear();
                };

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
                    var _view = null;

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

                    self.isVisible = function() {
                        return _isVisible;
                    };

                    self.show = function() {
                        getElem().addClass(app_defaults.item_visible_class).removeClass(app_defaults.item_hidden_class).removeClass(app_defaults.item_shrunk_class);
                        // 1000, "easeOutBounce"
                        if (_shrunk) {
                            getElem().addClass(app_defaults.item_shrunk_class);
                            _shrunk = false;
                        }
                        _isVisible = true;
                    };

                    self.hide = function(callback) {
                        getElem().addClass(app_defaults.item_hidden_class).removeClass(app_defaults.item_visible_class);
                        _isVisible = false;
                    };

                    self.dispose = function() {
                        if (!_disposed) {
                            _elem = null;
                            if (_isVisible) {
                                self.hide();
                                self.model = null;

                                $("#" + self.itemId + " .see-more-link").unbind('click');
                                if (_view) {
                                    _view.destroy();
                                    _view = null;
                                }
                                $("#" + self.listItemId).remove();
                            }
                            _disposed = true;
                        }
                    };

                    self.setView = function(view, config) {
                        _view = view;

                        $("#" + self.itemId + " .see-more-link").click(function(e) {
                            var htmlContent = $("#" + self.itemId + " .item-placeholder").html();
                            getElem().popover({
                                html: 'true',
                                content: htmlContent,
                                placement: function(context, source) {
                                    var position = $(collectionContainerId).offset();

                                    if (position.top > 500) {
                                        return "top";
                                    }

                                    if (position.left > 200) {
                                        return "left";
                                    }
                                    if (position.left < 200) {
                                        return "right";
                                    }
                                    if (position.top < 150) {
                                        return "bottom";
                                    }
                                    return "top";

                                },
                            });


                            getElem().on('shown.bs.popover', function() {
                                var contentElem = $("#" + self.listItemId + " .popover-content");
                                var elemHeight = contentElem.height();

                                contentElem.slimScroll({
                                    height: elemHeight,
                                    size: '15px'
                                });
                            });

                        });
                    };

                    self.getHeight = function() {
                        var h = getContainerElem().height();
                        return h;
                    };

                    self.setHeight = function(newHeight, shrunk) {
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
                 * Renders a model on the list container
                 * @param {type} page
                 * @param {type} containerHeight
                 * @returns {undefined}
                 */
                function PagedItemRenderer(page, containerHeight) {

                    var me = this;
                    var _currentHeight = 0;

                    function renderModel(item) {
                        var seeMoreText = "More ...";
                        var seeMoreHtml = String.format("<div class='pull-right see-more-link'><a href='javascript:void(0)'>{0}</a></div>", seeMoreText);
                        var containerHtml = String.format("<li id='{0}'><div id='{1}' class='item-container {2}'><div class='item-placeholder'></div>{3}</div></li>", item.listItemId, item.itemId, app_defaults.item_hidden_class, seeMoreHtml);
                        _ul.append(containerHtml);

                        var modelView = new kendo.View(_itemTemplate, {model: item.model, wrap: false});
                        modelView.render($("#" + item.itemId + " .item-placeholder"));

                        item.setView(modelView, _config);

                        var liText = $("#" + item.listItemId).html();
                    }

                    me.tryRenderItem = function(anItem, alreadyLoaded) {

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

                /*
                 * Renders items for the current page starting from a given array slice index
                 * @param {type} pageId
                 * @param {type} startIndex
                 * @param {type} containerHeight
                 * @returns {Number}
                 */
                function tryRenderPage(page, containerHeight, lastPage, updatePagingCounters, renderingCompleted) {

                    console.log(String.format("<tryRenderPage:{0}>", page.pageId));

                    if (lastPage) {
                        if (self.visibleItems.size() > 0) {
                            self.visibleItems.clear();
                        }
                    }

                    var itemRenderer = new PagedItemRenderer(page, containerHeight);

                    var ix = page.startIndex;
                    var shouldContinue = true;

                    // 1. Async fetching depends on data source content
                    // 2. isolate current index inside callback to avoid invalid index value
                    function renderNextItem(currentIndex, currentItem, currentPage) {

                        if (!currentItem) {
                            shouldContinue = false;
                            if (renderingCompleted) {
                                renderingCompleted(_dataSource, currentPage);
                            }
                            return;
                        }

                        var currentModel = new kendo.observable(currentItem);

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
                            currentPage.endIndex = currentIndex;
                            updatePagingCounters();
                            self.visibleItems.set(itemContainer);

                            var nextIndex = currentIndex + 1;
                            var nextPage = currentPage;

                            _dataSource.getItem(nextIndex, function(nextItem) {
                                renderNextItem(nextIndex, nextItem, nextPage);
                            });

                        } else {
                            self.visibleItems.remove(function(i) {
                                return i === itemContainer.itemId;
                            });
                            itemContainer.dispose();
                            shouldContinue = false;

                            if (renderingCompleted) {
                                renderingCompleted(_dataSource, currentPage);
                            }

                            return;
                        }
                    }

                    // getNext(_dataSource, ix, dataPage, renderNextItem);

                    var nextIndex = ix;
                    var nextPage = page;
                    _dataSource.getItem(nextIndex, function(item) {
                        renderNextItem(nextIndex, item, nextPage);
                    });

                }
                ;

                self.renderPage = function(page, containerHeight, lastPage, updatePagingCounters, renderingCompleted) {
                    if (_dataSource) {
                        utils.showSpinner(collectionContainerId);
                        tryRenderPage(page, containerHeight, lastPage, updatePagingCounters, renderingCompleted);
                    }
                };

                self.resizePage = function(page, containerHeight, updatePagingCounters, renderingCompleted) {
                    if (_dataSource) {
                        utils.showSpinner(collectionContainerId);
                        tryRenderPage(page, containerHeight, null, updatePagingCounters, renderingCompleted);
                    }
                };

            }

            /**
             * 
             * @param {type} realDataSource
             * @returns {undefined}
             */
            function DataSourceCache(realDataSource) {
                var self = this;

                var _dataSource = realDataSource;
                var _synced = false;
                var _total = 0;
                var _cachedItems = {};

                self.total = function() {
                    if (_synced) {
                        return _dataSource.total();
                    } else {
                        if (_dataSource) {
                            _dataSource.fetch(function() {
                                _synced = true;
                            });
                            return _dataSource.total();
                        } else {
                            return 0;
                        }
                    }
                };

                self.fetch = function(callback) {
                    if (_synced) {
                        callback();
                    } else {
                        if (_dataSource) {
                            _dataSource.fetch(function() {
                                callback();
                            });
                        } else {
                            callback();
                        }
                    }
                }

                function cacheCurrentPage(pageIndex) {
                    var dataview = _dataSource.view();
                    var pageStart = _dataSource.pageSize() * (pageIndex - 1);

                    if (isNaN(pageStart)) {
                        pageStart = 0;
                    }

                    for (var ix = 0; ix < dataview.length; ix++) {
                        if (!_cachedItems[pageStart + ix]) {
                            _cachedItems[pageStart + ix] = dataview[ix];
                        }
                    }
                }

                function fetchItem(ix, callback) {
                    if (ix < _dataSource.total()) {
                        if (_cachedItems[ix]) {
                            callback(_cachedItems[ix]);
                        } else {
                            var page = Math.ceil(ix / _dataSource.pageSize()) + 1;
                            var pageSize = _dataSource.pageSize();

                            if (_dataSource.page() != page || (!_cachedItems[ix])) {
                                _dataSource.query({
                                    page: page,
                                    pageSize: pageSize,
                                    serverPaging: true,
                                    serverSorting: true
                                });
                                _dataSource.page(page);

                                _dataSource.fetch(function() {
                                    _dataSource.page(page);
                                    cacheCurrentPage(page);
                                    callback(_cachedItems[ix]);
                                });

                            } else {
                                callback(_cachedItems[ix]);
                            }
                        }
                    } else {
                        callback(null);
                    }
                }

                self.getItem = function(ix, callback) {
                    if (_synced) {
                        fetchItem(ix, callback);
                    } else {
                        if (_dataSource) {

                            _dataSource.fetch(function() {
                                _synced = true;
                                var dataLen = _dataSource.total();
                                var page = Math.ceil(ix / dataLen) + 1;
                                cacheCurrentPage(page);
                                fetchItem(ix, callback);
                            });
                        } else {
                            callback(null);
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

                self.reset = function() {
                    _pageList = [];
                    _ix = 0;

                    _pageList.push(new Page(0));
                };
            }

            function getScriptPath() {
                var scripts = document.getElementsByTagName('SCRIPT');
                var path = '';
                if (scripts && scripts.length > 0) {
                    for (var i in scripts) {
                        if (scripts[i].src && scripts[i].src.match(/\/collectionviewer\.js$/)) {
                            path = scripts[i].src.replace(/(.*)\/collectionviewer\.js$/, '$1');
                            break;
                        }
                    }
                }
                path = path.replace(location.protocol + "//" + location.host, "").substring(1);
                return path;
            }

            function includeScript(scriptId, scriptPath, callback) {
                var scriptType = type = "text/x-kendo-layout";
                var script = document.getElementById(scriptId);
                if (!script) {

                    $.get(scriptPath).success(function(newhtml) {
                        var script = document.createElement('script');
                        script.type = scriptType;
                        script.id = scriptId;
                        script.text = newhtml;
                        document.body.appendChild(script);
                        callback();
                    });

                } else {
                    callback();
                }
            }

            function appendScript(scriptId, scriptTemplate, callback) {
                var scriptType = "text/x-kendo-layout";
                var script = document.createElement('script');
                script.type = scriptType;
                script.id = scriptId;
                script.text = scriptTemplate;
                document.body.appendChild(script);
                callback();

            }

            /*
             Dynamic Pager
             */
            function DynamicPager(pageContainerId, collectionContainerId, itemTemplate, dataSource, collectionName, config) {

                var self = this;

                var _collectionName = collectionName;
                var _pageContainerId = pageContainerId;
                var _collectionContainerId = collectionContainerId;
                var _pageNav = new PageNavigation();
                var _dataSource = new DataSourceCache(dataSource);
                var _renderer = null;
                var _itemTemplate = itemTemplate;
                var _config = config;

                var _collectionView = null;

                var _collectionElem = null;
                var _listElem = null;
                var _btnNext = null;
                var _btnPrev = null;

                var _viewLoaded = false;
                var _autoLoad = false;


                function initRenderer() {
                    if (_renderer) {
                        _renderer.dispose();
                    }

                    _renderer = new ItemsRenderer(_collectionContainerId, _collectionName, _config);
                    _dataSource = new DataSourceCache(dataSource);
                    _renderer.setDataSource(_dataSource, itemTemplate);

                    self.itemsCount = new ComputedBoundField(_collectionContainerId + " .paging .items-count", function() {
                        if (_dataSource) {
                            var r = _dataSource.total();
                            return r;
                        }
                    }).update();

                    self.fromVisible = new ComputedBoundField(_collectionContainerId + " .paging .visible-from", function() {
                        return _renderer.visibleRange.from.get() + 1;
                    }).update();

                    self.toVisible = new ComputedBoundField(_collectionContainerId + " .paging .visible-to", function() {
                        return _renderer.visibleRange.to.get() + 1;
                    }).update();
                }

                function initView() {
                    if (_collectionView) {
                        _collectionView.destroy();
                    }

                    _collectionView = new kendo.View(app_defaults.collection_view_template, {model: null, wrap: false});
                    _collectionView.render($(_collectionContainerId));

                    _collectionElem = $(_collectionContainerId);
                    _listElem = $(_collectionContainerId + " .collection-view .list-container");
                    _btnNext = $(_collectionContainerId + " .collection-view .paging .show-next");
                    _btnPrev = $(_collectionContainerId + " .collection-view .paging .show-prev");

                    _renderer.wrapElements();
                    _viewLoaded = true;

                }
                ;

                initRenderer();

                function updatePagingCounters() {
                    self.itemsCount.update();
                    self.fromVisible.update();
                    self.toVisible.update();
                }

                function pageRenderingCompleted(dataSource, currentPage) {
                    _btnPrev.attr("disabled", "disabled");
                    _btnNext.attr("disabled", "disabled");

                    var totalItems = dataSource.total();

                    if (currentPage.endIndex < (totalItems - 1)) {
                        _btnNext.removeAttr("disabled");
                    }

                    if (currentPage.pageId > 1) {
                        _btnPrev.removeAttr("disabled");
                    }

                    utils.hideSpinner();
                }


                /*
                 self.actualHeight.subscribe(function(newValue) {
                 console.log(newValue);
                 });
                 */

                function syncHeight() {
                    var stretchHeight = $(_pageContainerId).height();
                    var size = $(_collectionContainerId).offset();
                    var docHeight = $(document).height();

                    if (size) {
                        stretchHeight = $(window).height();
                        if (size.top < stretchHeight) {
                            _collectionElem.css("max-height", "100%");
                            _collectionElem.height(stretchHeight - size.top - 5);
                        } else {
                            var maxHeight = $(window).height();
                            stretchHeight = docHeight - size.top;
                            _collectionElem.css("height", stretchHeight);
                            _collectionElem.css("max-height", maxHeight);
                        }
                    }

                    return stretchHeight;
                }

                /**
                 * only for testing
                 * @returns {undefined}
                 */
                self.increaseBodySize = function() {
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
                        setTimeout(function() {
                            _renderer.resizePage(_pageNav.getCurrent(), getListHeight(), updatePagingCounters, pageRenderingCompleted);
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

                function getListHeight() {
                    var r = _listElem.height();
                    return r;
                }

                function showView(delay) {
                    var actualDelay = delay || 0;

                    syncHeight();
                    _pageNav.reset();
                    _btnPrev.attr("disabled", "disabled");
                    _btnNext.attr("disabled", "disabled");

                    setTimeout(function() {
                        _renderer.renderPage(_pageNav.getCurrent(), getListHeight(), null, updatePagingCounters, pageRenderingCompleted);
                        syncHeight();
                    }, actualDelay);

                }

                self.show = function(delay) {
                    if (_viewLoaded) {
                        showView(delay);
                    } else {
                        _autoLoad = true;
                    }
                };

                self.load = function(collectionContainerId, dataSource, itemTemplate) {
                    _collectionContainerId = collectionContainerId;
                    _itemTemplate = itemTemplate;
                    initView();
                    initRenderer();
                    _dataSource = new DataSourceCache(dataSource);
                    _renderer.wrapElements();
                    _renderer.setDataSource(_dataSource, _itemTemplate);

                    _btnNext.click(function() {
                        showNext();
                    });

                    _btnPrev.click(function() {
                        showPrev();
                    });


                };
                /*
                 * Renders a complete page
                 * @param {type} currentPage
                 * @param {type} lastPage
                 * @returns {undefined}
                 */
                function _renderPage(currentPage, lastPage) {
                    _renderer.renderPage(currentPage, getListHeight(), lastPage, updatePagingCounters, pageRenderingCompleted);
                }
                /*
                 * navigate to next page
                 */
                function showNext() {
                    console.log("<showNext>");

                    _btnPrev.attr("disabled", "disabled");
                    _btnNext.attr("disabled", "disabled");

                    var lastPage = _pageNav.getCurrent();
                    _pageNav.moveNext(lastPage.endIndex + 1);
                    _renderPage(_pageNav.getCurrent(), lastPage);
                }
                ;
                /*
                 * navigate to previous page
                 */
                function showPrev() {
                    console.log("<showPrev>");

                    _btnPrev.attr("disabled", "disabled");
                    _btnNext.attr("disabled", "disabled");

                    var lastPage = _pageNav.getCurrent();
                    _pageNav.movePrev();
                    _renderPage(_pageNav.getCurrent(), lastPage);
                }
                ;

                var _scriptPath = getScriptPath();

                /* event handler binding */
                $(document).ready(function() {
                    console.log();

                    appendScript(app_defaults.collection_view_template, viewTemplate, function() {
                        initView();

                        $(window).resize(onResize);
                        // $(window).on('scroll', onScroll);

                        _btnNext.click(function() {
                            showNext();
                        });

                        _btnPrev.click(function() {
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
                createCollectionViewer: function(pageContainerId, collectionContainerId, itemTemplate, dataSource, config) {
                    var collectionName = "my_collection_" + createUUID();
                    return new DynamicPager(pageContainerId, collectionContainerId, setOrDefault(itemTemplate, null), setOrDefault(dataSource, null), collectionName, merge(default_config, config));
                },
                defaults: app_defaults
            };

            return module;

        });

