/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

define(["jquery", "kendo", "collectionviewer", "text!templates/main-layout.html", "text!templates/item-template.html"],
        function($, kendo, collectionviewer, layoutTemplate, itemTemplate) {

            var app = {};

            app.init = function() {

                console.log();
                var _collectionViewer = new collectionviewer.createCollectionViewer("#main", "#collection-view-container");
                var _dataSource = null;
                function createItem(header, text, lines) {
                    var item = {header: header, text: ""};
                    for (var ix = 0; ix < lines; ix++) {
                        item.text += ix + ": " + text + "\n";
                    }
                    return item;
                }

                function loadDataSource() {
                    _collectionViewer.load("#collection-view-container", _dataSource, itemTemplate);
                    _collectionViewer.show();
                }

                window.loadCollection = loadDataSource;

                var collectionItems = [
                    createItem('01. asfsdfadf', 'sdfasdfasdf sdfasdfasdf', 2),
                    createItem('02. asfsdfadf', 'sdfasdfasdf sdfasdfasdf\n 456547547thjyuiyuifghg δφγυηρυτρτ ', 1),
                    createItem('03. asfsdfadf', 'sdfasdfasdf sdfasdfasdf 456456456 ghdfhgdfg sasdfasf vbmnXCdfg 678k', 55),
                    createItem('04. asfsdfadf', 'sdfasdfasdf sdfasdfasdf ', 1),
                    createItem('05. asfsdfadf', 'sdfasdfasdf sdfasdfasdf 456456456 ghdfhgdfg sasdfasf vbmnXCdfg 678k', 3),
                    createItem('06. asfsdfadf', 'sdfasdfasdf sdfasdfasdf ', 1),
                    createItem('07. asfsdfadf', 'sdfasdfasdf sdfasdfasdf', 2),
                    createItem('08. asfsdfadf', 'sdfasdfasdf sdfasdfasdf 456456456 ghdfhgdfg sasdfasf vbmnXCdfg 678k', 5),
                    createItem('09. asfsdfadf', 'sdfasdfasdf sdfasdfasdf 456456456 ghdfhgdfg sasdfasf vbmnXCdfg 678k', 3),
                    createItem('10. asfsdfadf', 'sdfasdfasdf sdfasdfasdf ', 1),
                    createItem('11. asfsdfadf', 'sdfasdfasdf sdfasdfasdf', 2),
                    createItem('12. asfsdfadf', 'sdfasdfasdf sdfasdfasdf 456456456 ghdfhgdfg sasdfasf vbmnXCdfg 678k', 5),
                    createItem('13. asfsdfadf', 'sdfasdfasdf sdfasdfasdf 456456456 ghdfhgdfg sasdfasf vbmnXCdfg 678k', 3),
                    createItem('14. asfsdfadf', 'sdfasdfasdf sdfasdfasdf', 2),
                    createItem('15. asfsdfadf', 'sdfasdfasdf sdfasdfasdf 456456456 ghdfhgdfg sasdfasf vbmnXCdfg 678k', 3)
                ];
                _dataSource = new kendo.data.DataSource({
                    data: collectionItems,
                });
                var appDefaults = collectionviewer.defaults;
                // immutable !!
                appDefaults.zero_opacity = 100;
                var mainLayout = new kendo.View(layoutTemplate, {
                    model: null,
                    wrap: false,
                    init: function() {

                        setTimeout(function() {
                            loadDataSource();
                        }, 250);
                    }
                });


                $(document).ready(function() {

                    $("#main-layout").html(mainLayout.render());
                });
            };

            return app;
        });
