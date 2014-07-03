/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


require.config({
    baseUrl: 'app',
    paths: {
        // the left side is the module ID,
        // the right side is the path to
        // the jQuery file, relative to baseUrl.
        // Also, the path should NOT include
        // the '.js' file extension. This example
        // is using jQuery 1.9.0 located at
        // js/lib/jquery-1.9.0.js, relative to
        // the HTML page.
        jquery: '../../bower_components/jquery/dist/jquery',
        underscore: '../../bower_components/underscore/underscore',
        text: '../../bower_components/requirejs-text/text',
        bootstrap: '../../bower_components/bootstrap/dist/js/bootstrap',
        can: '../../bower_components/canjs/amd/can',
        app: 'js',
        templates: 'templates',
        models: 'js/models',
        views: 'js/views',
        config: 'config'
    },
    shim: {
        'bootstrap': {
            deps: ['jquery'],
            exports: 'bootstrap'
        }
    }
});

requirejs(['app/start'], function(app) {
    console.log();
    app.start();
});
