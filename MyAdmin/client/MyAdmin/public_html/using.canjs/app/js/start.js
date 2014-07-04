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
    'views/resource',
    'models/topbar'], 
function($, app, router, topbarView, shellView, resourceView) {
    console.log();
    app.start = function() {
        app.utils.watchSize();
        router.start();
        return 0;
    };
    app.router = router;
    app.router.mapPath("resources/:group/:resource", function(pathData){
      console.log(pathData);  
      var viewPath = "{0}/{1}/{2}".format("resources", pathData.group,pathData.resource);
      var view = resourceView[viewPath];
      if(view) {
          view.render();
      }
    });
    
    var topbar = new app.models.TopbarModel();
    topbarView.render("#topbar", topbar);
    shellView.render("#workspace", {});
    return app;
});
