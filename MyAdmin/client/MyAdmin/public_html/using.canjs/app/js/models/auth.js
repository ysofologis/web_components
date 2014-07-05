/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

define(['can', 'app/init', 'models/base'], function(can, app) {
    var ModelConf = function(resourceName) {
        var that = this;
        that.findAll = 'GET {0}/{1}?Page={Page}&PageSize={PageSize}'.format(app.config.services.main.baseUrl, resourceName);
        that.findOne = 'GET {0}/{1}/{Id}'.format(app.config.services.main.baseUrl, resourceName);
        that.create = 'POST {0}/{1}'.format(app.config.services.main.baseUrl, resourceName);
        that.update = 'PUT {0}/{1}/{Id}'.format(app.config.services.main.baseUrl, resourceName);
        that.destroy = 'DELETE {0}/{1}/{Id}'.format(app.config.services.main.baseUrl, resourceName);
        that.parseModels = function(data){
            return data.Items;
        };
        return that;
    };
    
    var UserModel = can.Model.extend(new ModelConf('Users'),{});

    app.eventHub.subscribe(app.constants.events.APP_CONNECTED, function(sessionId) {
        UserModel.findAll({ Page:1, PageSize: 10 }, function(data) {
            console.log(data);
        }, function (err) {
            console.log(err);
        });
    });

    app.utils.namespace("models", app).UserModel = UserModel;
});
