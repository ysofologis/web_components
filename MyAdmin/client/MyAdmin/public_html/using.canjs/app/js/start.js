/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
define(['jquery', 'underscore', 
            'bootstrap', 
            'app/utils', 
            'text!views/shell.html',
            'text!views/topbar.html'], function($, _u1, _u2, 
                        utils, shellView, menuView) {
    console.log();
    var app = {
        start: function() {
            utils.watchSize();
            return 0;
        },
        utils: utils,
    };
    $("#workspace").html(shellView);
    $("#topbar").html(menuView);
    return app;
});
