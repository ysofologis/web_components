/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


(function($, can, app) {
    var createCouchTodo = function() {
        var defaultView = sprintf('GET %(baseUrl)s/%(db_name)s/_design/%(api_version)s/_view/%(default_view)s', app.config);
        var Todo = can.Model.extend({
            findAll: defaultView,
            makeFindAll: function(ajaxDispatcher) {
                return function(params, success, error) {
                    var self = this;
                    // is this not cached?
                    var def = ajaxDispatcher(params).then(function(data) {
                        // convert the raw data into instances
                        return self.models(_.map(data.rows, function(i) {
                            var r = i.value;
                            r.id = i.id;
                            return r;
                        }));
                    });
                    // hookup success and error
                    def.then(success, error);
                    return def;
                };
            },
            findOne: sprintf('GET %(baseUrl)s/%(db_name)s/{_id}', app.config),
            update: sprintf('PUT %(baseUrl)s/%(db_name)s/{_id}', app.config),
            destroy: sprintf('DELETE %(baseUrl)s/%(db_name)s/{_id}?rev={_rev}', app.config),
            destroy2: function(id) {
                console.log(id);
                var def = Todo.findOne({_id: id}, function(todo) {
                    var url = sprintf('%(baseUrl)s/%(db_name)s', app.config);
                    url += "/" + todo._id + "?rev=" + todo._rev;
                    var reqUrl = encodeURI(url);
                    $.ajax({
                        url: reqUrl,
                        type: 'DELETE',
                        success: function(r) {
                            console.log(r);
                        },
                        error: function(xhr) {
                            console.log(xhr);
                        }
                    });
                });
                return def;
            },
            destroy3: function(id) {
                var def = Todo.findOne({_id: id}, function(todo) {
                    todo._deleted = true;
                    todo.save();
                });
                return def;
            }
        },
        {
            is_completed: function() {
                var r = this.attr("status") === "completed";
                return r;
            }
        });

        return Todo;
    };

    $(document).ready(function() {
        console.log();

        var initModels = function() {
            var Todo = createCouchTodo();
            var todoTemplate = app.utils.getTemplate("todo-app");
            can.Component.extend({
                tag: 'todos-app',
                template: todoTemplate,
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

            var viewTemplate = can.view.mustache("<todos-app></todos-app>");
            $("#todo-view").html(viewTemplate());
        };

        app.shell.init(function() {
            setTimeout(initModels, 0);
        });
    });

})(jQuery, can, window.app);