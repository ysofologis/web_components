/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


define(['jquery', 'can', 'app/init', 'app/utils', 'models/base'],
        function($, can, app) {
            var ResourceModel = app.models.AppModel.extend(function () {
                var that = this;
                
                that.menu = [
                    { 
                        name: 'default',
                        text: 'Default Action',
                        route: 'default'
                    }
                ];
                
                return that;
            });

            app.models.ResourceModel = ResourceModel;
        });
