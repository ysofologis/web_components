/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

define(['jquery', 'can', 'app/init',
    'toastr', 'bootbox', 'spin',
    'underscore', 'bootstrap', 'app/extensions'],
        function($, can, app, toastr, bootbox, Spinner) {
            console.log();

            toastr.options = {
                "closeButton": true,
                "debug": false,
                "positionClass": "toast-bottom-right",
                "onclick": null,
                "showDuration": "300",
                "hideDuration": "1000",
                "timeOut": "5000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            };

            var spinopts = {
                lines: 12, // The number of lines to draw
                length: 4, // The length of each line
                width: 4, // The line thickness
                radius: 8, // The radius of the inner circle
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
                top: '50%', // Top position relative to parent
                left: '50%' // Left position relative to parent            };
            };
            
            var spinner = new Spinner(spinopts);

            app.utils = {
                watchSize: function() {
                    $(window).resize(function(e) {
                        $("#client-rect").text("SIZE: [{0}x{1}]".format(window.innerWidth, window.innerHeight));
                    });
                    $("#client-rect").text("SIZE: [{0}x{1}]".format(window.innerWidth, window.innerHeight));
                },
                namespace: function(ns, root_ns) {
                    var chunks = ns.split('.');
                    if (!root_ns)
                        root_ns = window;
                    var current = root_ns;
                    for (var i = 0; i < chunks.length; i++) {
                        if (!current.hasOwnProperty(chunks[i]))
                            current[chunks[i]] = {};
                        current = current[chunks[i]];
                    }
                    return current;
                },
                showInfo: function(message, title) {
                    toastr.success(message, title);
                },
                showError: function(message, title) {
                    toastr.error(message, title);
                },
                confirm: function(message, callback) {
                    bootbox.confirm(message, function(e) {
                        if (callback) {
                            callback(e);
                        }
                    });
                },
                prompt: function(message, callback) {
                    bootbox.prompt(message, function(e) {
                        if (callback) {
                            callback(e);
                        }
                    });
                },
                startProgress : function() {
                    var spinElem = $("#app-spinner")[0];
                    spinner.spin(spinElem);
                },
                endProgress : function() {
                    spinner.stop();
                }
            };
        });

