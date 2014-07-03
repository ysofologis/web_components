/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


define(['jquery', 'can', 'text!templates/shell.html'], 
    function($, can, template) {
        console.log();
        return {
          render : function(containerId, viewModel) {
            var view = can.mustache(template);
            var content = view(viewModel);
            $(containerId).html(content);
          }  
        };
});
