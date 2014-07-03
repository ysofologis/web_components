/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
define(['jquery', 'underscore',
    'bootstrap',
    'app/init',
    'views/topbar',
    'views/shell',
    'models/session'], 
function($, _u1, _u2, app, topbarView, shellView) {
    console.log();
    app.start = function() {
        app.utils.watchSize();
        return 0;
    };
    var clientSession = new app.models.Session();
    topbarView.render("#topbar", clientSession);
    shellView.render("#workspace", {});
    return app;
});
