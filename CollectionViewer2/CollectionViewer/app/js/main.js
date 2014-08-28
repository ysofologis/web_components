/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

requirejs.onError = function (err) {
    console.log(err.requireType);
    if (err.requireType === 'timeout') {
        console.log('modules: ' + err.requireModules);
    }

    throw err;
};

requirejs.config({
    paths: {
        init: 'app/init',
        collectionviewer: 'widgets/collectionviewer',
        text: 'lib/text',
        kendo: 'lib/kendo.all.min',
        bootstrap: 'lib/bootstrap',
        spin: 'lib/spin',
        underscore: 'lib/underscore',
        jquery: 'lib/jquery',
    },
    shim: {
        underscore: {
            exports: '_'
        },
        bootstrap: {
            deps: ['jquery'],
            exports: 'jQuery'
        },
        spin: {
            deps: ['jquery']
        }
    }
});

require(['jquery'], function($) {
    
        console.log();
    
    }, function(err) {
        
        console.log(err);
    
    });