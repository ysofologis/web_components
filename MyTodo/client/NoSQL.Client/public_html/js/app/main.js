/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


(function($, can, app) {
    $(document).ready(function() {
        console.log();

        var initModels = function() {
            var tpl = app.utils.getTemplate("todo-app");
            var defaultView = sprintf('GET %(baseUrl)s/%(db_name)s/_design/%(api_version)s/_view/%(default_view)s', app.config);
            var Todo = can.Model.extend({
                findAll: defaultView,
                makeFindAll: function(ajaxDispatcher) {
                    return function(params, success, error) {
                        var self = this;
                        // is this not cached?
                        var def = ajaxDispatcher(params).then(function(data) {
                            // convert the raw data into instances
                            return self.models(data.rows);
                        });
                        // hookup success and error
                        def.then(success, error);
                        return def;
                    };
                },
                findOne: sprintf('GET %(baseUrl)s/%(db_name)s/{id}', app.config),
                update: sprintf('PUT %(baseUrl)s/%(db_name)s/{id}', app.config),
                destroy: sprintf('DELETE %(baseUrl)s/%(db_name)s/{id}', app.config)
            }, {});

            Todo.findAll({limit: 5}, function(d) {
                console.log(d);
            }, function(xhr) {
                console.log(xhr);
            });

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
        };

        app.shell.init(function() {
            setTimeout(initModels, 0);
        });
    });

})(jQuery, can, window.app);