/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


console.log();

require.config({
    baseUrl: 'js/lib',
    paths: {
        text: 'require/text',
        underscore: 'underscore/underscore',
        jquery: 'jquery/jquery',
        'jquery.slimscroll': 'jquery/jquery.slimscroll',
        kendo: 'kendo/kendo.all.min',
        knockout: 'knockout/knockout',
        bootstrap : 'bootstrap/bootstrap',
        spin : 'spin/spin',
        collectionviewer : '../app/collectionviewer/collectionviewer',
        templates : '../../templates',
        app: '../app/app',
        
    },
    shim: {
        underscore: {
            exports: '_'
        },
        bootstrap : ["jquery"],
        spin : {
            deps: ["jquery"],
        },
        'jquery.slimscroll' : ['jquery']
    }
});

require(["app", "text!templates/collection-view.html"], function(app, testHtml) {
    app.init();
});