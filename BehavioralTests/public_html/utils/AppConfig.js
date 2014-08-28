/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var appConfig = (function($) {
    var _conf = {};
    var readConfig = function(configName, callback) {
        if (!_conf[configName]) {
            var fileUrl = "conf/" + configName + ".json";
            $.ajax({
                url: fileUrl,
                async: false,
                success: function(json) {
                    _conf[configName] = json;
                    if (callback) {
                        callback(_conf[configName]);
                    }
                },
                error: function(xhr) {
                    console.log(xhr);
                }
            });
            if(_conf[configName]) {
                return _conf[configName];
            }
        } else {
            if (callback) {
                callback(_conf[configName]);
            } else {
                return _conf[configName];
            }
        }
    };

    return {
        get: readConfig
    };
})(jQuery);