/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


define([], function() {

    function addConstantValue(obj, name,value) {
        Object.defineProperty(obj, name, {
            enumerable: true,
            configurable: false,
            writable: false,
            value: value,
        });
    }

    var constants = {
    };

    var events = {
    };
    
    addConstantValue(events,"APP_CONNECTED","app-connected");
    addConstantValue(events,"APP_DISCONNECTED","app-disconnected");
    addConstantValue(events,"USER_LOGGED_IN","user-loggedin");
    addConstantValue(events,"USER_LOGGED_OUT","user-loggedout");
    addConstantValue(constants,"events", events);

    return constants;
});