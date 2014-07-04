/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


define(['can', 'app/utils'], function(can, utils) {

    var _routingCallbacks = {};

    can.route.ready(false);
    /*
    var RoutingControl = can.Control({
        'route': function(data) {
            console.log();
        },
        ':context/:group/:resource route': function(data) {
            console.log();
        },
        ':context/:group/:resource/:id route': function(data) {
            console.log();
        }
    });*/
    var _routing = null;
    can.route.bind('change', function(ev, attr, how, newVal, oldVal) {
        console.log();
    });

    var router = {
        start: function() {
            var RoutingControl = can.Control(_routingCallbacks);
            _routing = new RoutingControl(document);
            console.log("starting routing");
            can.route.ready(true);
        },
        navigateTo: function(path) {
            console.log("navigating to [{0}]".format(path));
        },
        mapPath: function(path, callback) {
            _routingCallbacks[path + " route"] = function(data) {
                if(callback) {
                    callback(data);
                }
            };
        },
        getMappedPaths: function() {
            return Object.keys(_routingCallbacks);
        }
    };

    return router;
});