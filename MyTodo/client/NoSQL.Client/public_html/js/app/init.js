/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

console.log();

+function($, _, amplify, app) {
    console.log();

    amplify.request.define("check_db", "ajax", {
        url: "{baseUrl}/_all_dbs",
        type: "GET",
        dataType: "json"
    });

    amplify.request.define("get_bucket_doc", "ajax", {
        url: "{baseUrl}/buckets/{bucket}/keys/{doc}",
        type: "GET"
    });
    amplify.request.define("set_bucket_doc", "ajax", {
        url: "{baseUrl}/buckets/{bucket}/keys/{doc}",
        type: "PUT"
    });

    var serviceInitialized = false;
    var shell = {
        init: function(callback) {
            $.getJSON("conf/app.json", function(confData) {
                app.config = confData;
                if (!serviceInitialized) {
                    amplify.request("check_db", {baseUrl: app.config.baseUrl}, function(data) {
                        for (var i in data) {
                            var db_name = data[i];
                            if (db_name == app.config.db_name) {
                                serviceInitialized = true;
                                if (callback) {
                                    callback();
                                }
                                break;
                            }
                        }
                    });
                } else {
                    if (callack) {
                        callback();
                    }
                }
            });
        }
    };

    var utils = {
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