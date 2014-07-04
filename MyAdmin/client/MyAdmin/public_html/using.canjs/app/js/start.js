/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
define(['jquery', 
    'app/init',
    'views/topbar',
    'views/shell',
    'models/topbar'], 
function($, app, topbarView, shellView) {
    console.log();
    app.start = function() {
        app.utils.watchSize();
        return 0;
    };
    var topbar = new app.models.TopbarModel();
    topbarView.render("#topbar", topbar);
    shellView.render("#workspace", {});
    return app;
});
