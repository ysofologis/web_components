/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

define(['jquery', 'can', 'app/init', 'toastr', 'underscore', 'bootstrap', 'app/extensions'],
        function($, can, app, toastr) {
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
                }
            };
        });

