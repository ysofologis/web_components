/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


console.log();

require.config({
    baseUrl: 'js/lib',
    paths: {
        underscore: 'underscore/underscore',
        jquery: 'jquery/jquery',
        kendo: 'kendo/kendo.web.min',
        knockout: 'knockout/knockout'
    },
    shim: {
        underscore: {
            exports: '_'
        },
        bootstrap : ["jquery"]
    }
});

require(["underscore","jquery", "kendo", "knockout"], 
function(_,$, kendo, knockout) {
    console.log();
});
