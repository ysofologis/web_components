/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


define(['jquery', 'can', 'app/init', 'text!config/resources.json', 'models/auth'], function($, can, app, resJson) {
    console.log();
    function doRender(templatePath, resourceModel) {
        require([templatePath], function(template) {
            var view = can.mustache(template);
            var content = view(resourceModel);
            $("#resource-view").html(content);
        });
    }

    var resConf = JSON.parse(resJson);
    var resourceViews = {};
    for (var ix = 0; ix < resConf.mapping.length; ix++) {
        var rconf = resConf.mapping[ix];
        (function(resourceViews, rconf) {
            var rview = {
                render: function() {
                    var template = "text!{0}".format(rconf.template);
                    var modelClass = app.utils.getClass(app, rconf.model.replace("app.", ""));
                    var model = new modelClass();
                    doRender(template, model);
                }
            };
            var path = rconf.path;
            resourceViews[path] = rview;
        })(resourceViews, rconf);
    }
    return resourceViews;
});