/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


define(['can', 'app/utils'], function(can, utils) { 
    var router = {
        start: function() {
            console.log("starting routing");
        },
        navigateTo: function(path) {
            console.log( "navigating to [{0}]".format(path));
        }
    };
    
    return router;
});