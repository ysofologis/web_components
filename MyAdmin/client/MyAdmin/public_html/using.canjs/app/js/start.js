/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
define(['jquery', 
    'app/init',
    'app/router',
    'views/topbar',
    'views/shell',
    'models/topbar'], 
function($, app, router, topbarView, shellView) {
    console.log();
    app.start = function() {
        app.utils.watchSize();
        router.start();
        return 0;
    };
    app.router = router;
    
    var topbar = new app.models.TopbarModel();
    topbarView.render("#topbar", topbar);
    shellView.render("#workspace", {});
    return app;
});
