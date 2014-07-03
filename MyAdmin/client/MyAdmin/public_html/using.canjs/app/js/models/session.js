/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


define(['jquery', 'can', 'app/init', 'app/utils'],
        function($, can, app) {
            var services = app.config.services;

            app.utils.namespace("models", app).Session = function() {
                var that = this;
                var _data = new can.Map({sessionId: "", userName: "sdsdfsdf", userId: "", userLang: "", lastRequest: ""});
                that.login = function(account, password, onsuccess, onerror) {
                    var headers = {};
                    var creds = '{0}:{1}'.format(account, password);
                    headers['Authorization'] = 'basic {0}'.format(btoa(creds));
                    $.ajax({
                        url: "{0}/Sessions".format(services.main.baseUrl),
                        async: true,
                        contentType: 'application/json',
                        headers: headers,
                        method: 'POST',
                        crossDomain: true,
                        success: function(resp) {
                            _data.attr("sessionId", resp.SessionId);
                            _data.attr("userName", resp.UserId);
                            _data.attr("userId", resp.Username);
                            _data.attr("userLang", resp.UserLanguage);
                            _data.attr("lastRequest", resp.LastRequest);
                            if (onsuccess) {
                                onsuccess();
                            }
                        },
                        error: function(resp) {
                            _data.attr("sessionId", "");
                            _data.attr("userName", "");
                            _data.attr("userId", "");
                            _data.attr("userLang", "");
                            _data.attr("lastRequest", "");
                            console.error(resp);
                            if (onerror) {
                                onerror();
                            }
                        }
                    });
                };
                that.data = function() {
                    return _data;
                };
                that.save = function(storage) {
                    storage.set('__session', JSON.stringify(_data));
                };
                that.load = function(storage) {
                    var r = storage.get('__session');
                    _data = JSON.parse(r);
                };
                that.appendHeaders = function(apiHeaders) {
                    var headers = apiHeaders || {};
                    headers['session-id'] = _data.attr("sessionId");
                    return headers;
                };
            };

        });