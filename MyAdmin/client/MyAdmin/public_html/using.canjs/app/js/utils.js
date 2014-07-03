/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

define(['jquery', 'can', 'app/init', 'underscore', 'bootstrap', 'app/extensions'],
        function($, can, app) {
            console.log();
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
                }
            };
        });

