/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

define(['jquery', 'underscore', 'bootstrap', 'app/extensions'], function($) {
    console.log();
    var utils = {
        watchSize: function() {
            $(window).resize(function(e) {
                $("#client-rect").text("SIZE: [{0}x{1}]".format(window.innerWidth,window.innerHeight));
            });
            $("#client-rect").text("SIZE: [{0}x{1}]".format(window.innerWidth,window.innerHeight));
        }
    };
    return utils;
});

