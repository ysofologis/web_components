/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


define(['jquery'], function($) {
    var _callbacks = {};
    
    function broadcastEvent(eventName, data) {
        var callbackList = _callbacks[eventName];
        for (var ix = 0; ix < callbackList.length; ix++) {
            var cb = callbackList[ix];
            if (cb) {
                (function(clientCallback, data) {
                    setTimeout(function() {
                        clientCallback(data);
                    }, 0);
                })(cb, data);
            }
        }
    }
    
    var eventHub = {
        publish: function(eventName, eventData) {
            $("#event-hub").trigger(eventName, [eventData]);
        },
        subscribe: function(eventName, callback) {
            if (!_callbacks[eventName]) {
                _callbacks[eventName] = [callback];
                $("#event-hub").on(eventName, function(e,data) {
                    broadcastEvent(eventName,data);
                });
            } else {
                _callbacks[eventName].push(callback);
            }
        }
    };
    return eventHub;
});