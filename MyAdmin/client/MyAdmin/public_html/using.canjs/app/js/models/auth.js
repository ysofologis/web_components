/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

define(['can', 'app/init', 'models/base'], function(can, app) {
    var ModelConf = function(resourceName) {
        var that = this;
        that.findAll = 'GET {0}/{1}?Page={page}&PageSize={pageSize}'.format(app.config.services.main.baseUrl, resourceName);
        that.findOne = 'GET {0}/{1}/{Id}'.format(app.config.services.main.baseUrl, resourceName);
        that.create = 'POST {0}/{1}'.format(app.config.services.main.baseUrl, resourceName);
        that.update = 'PUT {0}/{1}/{Id}'.format(app.config.services.main.baseUrl, resourceName);
        that.destroy = 'DELETE {0}/{1}/{Id}'.format(app.config.services.main.baseUrl, resourceName);
        that.parseModels = function(data){
            return data.Items;
        };
        return that;
    };
    
    var ItemModel = can.Model.extend(new ModelConf('Users'),{
        toString: function() {
            return this.Username;
        } 
    });
    var ScopeModel = app.models.AppModel.extend({
        page: 1,
        pageSize: 10,
        items: function() {
            var page = this.attr("page");
            var pageSize = this.attr("pageSize");
            var r = ItemModel.findAll({ page: page, pageSize: pageSize }, function(data) {
                console.log(data);
            }, function(err) {
                var msg = "{0} --> {1}".format(err.status,err.statusText);
                app.utils.showError(msg);
            });
            return r;
        }
    });

/*
    app.eventHub.subscribe(app.constants.events.APP_CONNECTED, function(sessionId) {
        ItemModel.findAll({ page:1, pageSize: 10 }, function(data) {
            console.log(data);
        }, function (err) {
            console.log(err);
            app.utils.showError(err);
        });
    });
*/
    app.utils.namespace("models", app).UserModel = ScopeModel;
});
