/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

define(['can', 'app/init', 'models/base'], function(can, app) {
    var UserModel = can.Model.extend(
            {
                findAll : 'GET {0}/Users'.format(app.config.services.main.baseUrl),
                findOne : 'GET {0}/Users/{Id}'.format(app.config.services.main.baseUrl),
                create : 'POST {0}/Users'.format(app.config.services.main.baseUrl),
                update : 'PUT {0}/Users/{Id}'.format(app.config.services.main.baseUrl),
                destroy : 'DELETE {0}/Users/{Id}'.format(app.config.services.main.baseUrl)
            },
            {});
     
     var items = UserModel.findAll();
     
     app.utils.namespace("models", app).UserModel = UserModel;
});
