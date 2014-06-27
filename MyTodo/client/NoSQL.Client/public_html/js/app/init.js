/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


+function($, _, amplify, app) {
    amplify.request.define("check_db", "ajax", {
        url: "{baseUrl}/_all_dbs",
        type: "GET",
        dataType: "json",
        crossDomain: true
    });

    amplify.request.define("get_bucket_doc", "ajax", {
        url: "{baseUrl}/buckets/{bucket}/keys/{doc}",
        type: "GET"
    });
    amplify.request.define("set_bucket_doc", "ajax", {
        url: "{baseUrl}/buckets/{bucket}/keys/{doc}",
        type: "PUT"
    });

    var shell = {
        init: function(callback) {
            $.getJSON("conf/app.json", function(confData) {
                app.config = confData;
                if (!app.config.initDatabase) {
                    amplify.request("check_db", {baseUrl: app.config.baseUrl}, function(data) {
                        for (var i in data) {
                            var db_name = data[i];
                            if (db_name === app.config.db_name) {
                                if (callback) {
                                    callback();
                                }
                                break;
                            }
                        }
                    });
                } else {
                    if (callback) {
                        callback();
                    }
                }
            });
        }
    };

    var utils = {
        getTemplate: function(name) {
            var content = null;
            var templateUri = sprintf("templates/%s.mustache", name);
            $.ajax({
                url : templateUri, 
                async : false,
                success: function(data) {
                    content = $(data.documentElement).html();
                },
                error: function(xhr) {
                    console.log(xhr);
                    if(xhr.status === 200) {
                        content = xhr.responseText;
                    }
                }
            });
            return content;
        },
        getDocument: function(database, name) {
        },
        putResource: function(database, name) {

        }
    };

    Object.defineProperty(app, "utils", {
        enumerable: true,
        configurable: false,
        value: utils
    });
    Object.defineProperty(app, "shell", {
        enumerable: true,
        configurable: false,
        value: shell
    });

}(jQuery, _, amplify, window.app);