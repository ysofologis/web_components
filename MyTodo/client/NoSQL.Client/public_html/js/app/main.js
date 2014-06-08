/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


(function($, can, app) {
    $(document).ready(function() {
        console.log();
        
        var initModels = function () {
            var defaultView = sprintf('GET %(baseUrl)s/%(db_name)s/_design/%(api_version)s/_view/%(default_view)s', app.config);
            var Todo = can.Model.extend({
                findAll: defaultView,
                findOne: sprintf('GET %(baseUrl)s/%(db_name)s/{id}', app.config),
                update: sprintf('PUT %(baseUrl)s/%(db_name)s/{id}', app.config),
                destroy: sprintf('DELETE %(baseUrl)s/%(db_name)s/{id}', app.config)
            }, {});
            
            var l = new Todo.List();

            can.Component.extend({
                tag: 'todos-app',
                scope: {
                    selectedTodo: null,
                    todos: new Todo.List({}),
                    select: function(todo) {
                        this.attr('selectedTodo', todo);
                    },
                    save: function(todo) {
                        todo.save();
                        this.removeAttr('selectedTodo');
                    }
                }
            });
        }
        
        app.shell.init(function() {
            setTimeout(initModels,0);
        });
    });

})(jQuery, can, window.app);