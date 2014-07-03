/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


define(['can', 'app/init', 'app/utils'], function(can,app) {
    console.log();
    app.utils.namespace("models", app).AppModel = can.Map.extend({
        get: function(attrname) {
            return this.attr(attrname);
        },
        set: function(name, value) {
            this.attr(name,value);
        }
    });
});