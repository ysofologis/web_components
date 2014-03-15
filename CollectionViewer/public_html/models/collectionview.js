/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


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

function CollectionViewer(pageContainerId, collectionContainerId, items, collectionName) {

    function ItemContainer(id, model, idPrefix) {
        var self = this;

        self.itemId = idPrefix + "-item-" + id;
        self.model = model;
        
        var _isVisible = true;

        //self.opacity = ko.observable(app_defaults.zero_opacity);
        
        self.isVisible = function(){
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
    
    function ItemsRange(from, to) {
        this.from = ko.observable(from);
        this.to = ko.observable(to);
    }

    function ItemsPage(items, idPrefix) {

        var self = this;

        self.availableItems = [];
        self.pageIndex = ko.observable(1);
        self.visibleRange = new ItemsRange(0, items.length-1);

        if (items) {
            _.each(items, function(i) {
                self.availableItems.push(new ItemContainer(self.availableItems.length + 1, i, idPrefix));
            });
        }

        self.showItems = function(containerHeight) {

            var currentHeight = 0.0;
            var lastIndex = 0;

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

                        return true;

                    } else {
                        console.log("item exceeds container height.");
                        
                        if ( ! anItem.isVisible() ) {
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

    var self = this;

    // var _collectionName = collectionName;
    var _pageContainerId = pageContainerId;
    var _collectionContainerId = collectionContainerId;

    self.actualHeight = ko.observable("100%");
    self.allItems = ko.observable(items);
    self.currentPage = new ItemsPage(items, collectionName);
    self.lastVisibleIndex = ko.observable(0);
    
    self.itemsCount = ko.computed(function () {
       var r = self.allItems().length;
       return r;
    }, self);
    
    
    self.hasPrev = ko.computed(function () {
        return self.currentPage.pageIndex() > 1;
    }, self);
    
    self.hasNext = ko.computed(function () {
        return self.lastVisibleIndex() < (self.itemsCount() - 1);
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

    self.increaseBodySize = function() {
        var h = $('body').height();
        h += h * 0.10;
        $('body').height(h);
    };

    function _onResize(e) {
        console.log(e);
        setTimeout(function() {
            syncHeight();
            self.show(app_defaults.show_hide_delay);
        },app_defaults.resize_delay);
    }
    

    var lastScroll = 0;

    function _onScroll(e) {
        console.log(e);
        var currentScroll = $(window).scrollTop();
        // is this 'scroll-down' ?
        if (currentScroll > lastScroll) {
            setTimeout(function () {
                syncHeight();
                self.show(app_defaults.show_hide_delay);
            }, app_defaults.resize_delay);
        }
        
        lastScroll = currentScroll;
    };

    $(document).ready(function() {

        $(window).resize(_onResize);
        $(window).on('scroll', _onScroll);

    });

    // window.document.body.onresize = self._onResize;
    var _lastShow = new Date();

    self.show = function(delay) {
        
        var nowTime = new Date();
        var duration = nowTime - _lastShow;
        
        if ( duration >= delay ) {
            setTimeout(function() {
                var lastIndex = self.currentPage.showItems($(_collectionContainerId).height());
                self.lastVisibleIndex(lastIndex);
            }, delay);
            
            _lastShow = nowTime;
        }
    };
    
    self.showNext = function() {
        console.log("<showNext>");
    };
    
    self.showPrev = function() {
        console.log("<showPrev>");
        
    };

}

function createItem(header, text, lines) {
    var item = {header: header, text: ""};

    for (var ix = 0; ix < lines; ix++) {
        item.text += text + "\n";
    }

    return item;
}

var collectionItems = [
    createItem('01. asfsdfadf', 'sdfasdfasdf sdfasdfasdf', 2),
    createItem('04. asfsdfadf', 'sdfasdfasdf sdfasdfasdf ', 1),
    createItem('02. asfsdfadf', 'sdfasdfasdf sdfasdfasdf 456456456 ghdfhgdfg sasdfasf vbmnXCdfg 678k', 5),
    createItem('03. asfsdfadf', 'sdfasdfasdf sdfasdfasdf 456456456 ghdfhgdfg sasdfasf vbmnXCdfg 678k', 3),
    createItem('04. asfsdfadf', 'sdfasdfasdf sdfasdfasdf ', 1),
    createItem('05. asfsdfadf', 'sdfasdfasdf sdfasdfasdf', 2),
    createItem('06. asfsdfadf', 'sdfasdfasdf sdfasdfasdf 456456456 ghdfhgdfg sasdfasf vbmnXCdfg 678k', 5),
    createItem('07. asfsdfadf', 'sdfasdfasdf sdfasdfasdf 456456456 ghdfhgdfg sasdfasf vbmnXCdfg 678k', 3),
    createItem('08. asfsdfadf', 'sdfasdfasdf sdfasdfasdf ', 1),
    createItem('09. asfsdfadf', 'sdfasdfasdf sdfasdfasdf', 2),
    createItem('10. asfsdfadf', 'sdfasdfasdf sdfasdfasdf 456456456 ghdfhgdfg sasdfasf vbmnXCdfg 678k', 5),
    createItem('11. asfsdfadf', 'sdfasdfasdf sdfasdfasdf 456456456 ghdfhgdfg sasdfasf vbmnXCdfg 678k', 3),
    createItem('12. asfsdfadf', 'sdfasdfasdf sdfasdfasdf', 2)
];

var collectionViewer = new CollectionViewer("#main", 
                                        "#view-container .collection-view .list-container", 
                                        collectionItems, 
                                        "my-collection");

ko.applyBindings(collectionViewer);

collectionViewer.show(0);