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
    'models/session'], 
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
    
    app.eventHub.subscribe(app.constants.events.USER_LOGGED_IN, function(session) {
       console.log(); 
       app.currentSession = session;
       app.storage.local.save("app.session", session);
       app.eventHub.publish(app.constants.events.APP_CONNECTED, session.SessionId);
    });
    app.eventHub.subscribe(app.constants.events.USER_LOGGED_OUT, function(data) {
       console.log(); 
       app.currentSession = null;
       app.storage.local.purge("app.session");
    });
    
    app.currentSession = app.storage.local.load("app.session");
    can.ajaxPrefilter(function(options, originalOptions, jqXHR){
        if(app.currentSession) {
          jqXHR.setRequestHeader('session-id', app.currentSession.SessionId);
      }
    });

    app.eventHub.subscribe(app.constants.events.APP_DISCONNECTED, function(data) {
       app.currentSession = null;
       app.storage.local.purge("app.session");
    });

    var topbar = new app.models.SessionModel();
    if(app.currentSession) {
        topbar.updateSession(app.currentSession);
        app.eventHub.publish(app.constants.events.APP_CONNECTED, app.currentSession.SessionId);
    }
    
    topbarView.render("#topbar", topbar);
    shellView.render("#workspace", {});
    router.navigateTo("");
    
    return app;
});
