
define(["kendo", "app", "viewmodels"], function(kendo, app, viewmodels) {

    function ColumnVM(normalClass, hiddenClass, expandClass, stretchClass, isHidden) {

        this.options = {cssClass: normalClass, isVisible: true, previousClass: null, };

        this.isVisible = function() {
            return this.options.isVisible;
        }

        if (isHidden) {
            this.options.isVisible = false;
            this.options.cssClass = hiddenClass;
        }

        this.toggleAutoHide = function() {
            if (this.isVisible()) {
                this.options.isVisible = false;
                this.options.previousClass = this.options.cssClass;
                this.options.cssClass = hiddenClass;
            } else {
                this.options.isVisible = true;
                this.options.previousClass = this.options.cssClass;
                this.options.cssClass = normalClass;
            }

            this.trigger("change", {field: "options"});
            return this.isVisible();
        };

        this.expand = function() {
            this.options.previousClass = this.options.cssClass;
            this.options.cssClass = expandClass;
            this.options.isVisible = true;
            this.trigger("change", {field: "options"});
        };

        this.stretch = function() {
            this.options.previousClass = this.options.cssClass;
            this.options.cssClass = stretchClass;
            this.options.isVisible = true;
            this.trigger("change", {field: "options"});
        };

        this.reset = function() {
            this.options.previousClass = this.options.cssClass;
            this.options.cssClass = normalClass;
            this.options.isVisible = true;
            this.trigger("change", {field: "options"});
        };
    }

    function LayoutVM() {
        var self = this;

        self.leftSide = new ColumnVM("full-height col-lg-3 col-md-3 col-sm-3", "full-height col-lg-3 col-md-3 col-sm-3 hide-column",
                "full-height col-lg-3 col-md-3 col-sm-3"),
                self.contentArea = new ColumnVM("full-height col-lg-7 col-md-7 col-sm-6", "hide-column",
                        "full-height col-lg-9 col-md-9 col-sm-9",
                        "full-height col-lg-12 col-md-12 col-sm-12"),
                self.rightSide = new ColumnVM("full-height col-lg-2 col-md-2 col-sm-3",
                        "hide-column",
                        "full-height col-lg-3 col-md-3 col-sm-3"),
                self.toggleLeft = function() {
                    var lSide = this.get("leftSide");
                    var rSide = this.get("rightSide");
                    var main = this.get("contentArea");

                    if (lSide.toggleAutoHide()) {
                        main.reset();
                        rSide.reset();
                    } else {
                        rSide.expand();
                        main.expand();
                    }
                },
                self.toggleRight = function() {
                    var rSide = this.get("rightSide");
                    var lSide = this.get("leftSide");
                    var main = this.get("contentArea");

                    if (rSide.toggleAutoHide()) {
                        main.reset();
                        lSide.reset();
                    } else {
                        lSide.expand();
                        main.expand();
                    }
                }
    }

    viewmodels.LayoutVM = LayoutVM;
    
    return viewmodels;
});
﻿
