/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


define(['jquery', 'can', 'app/init', 'app/utils'],
        function($, can, app) {
            var services = app.config.services;
            var SessionModel = can.Map.extend({
                session: {sessionId: "", userName: "sysadmin", password: "PASSW0RD", userId: "", userLang: "", lastRequest: ""},
                login: function(onsuccess, onerror) {
                    var headers = {};
                    var session = this.attr("session");
                    var creds = '{0}:{1}'.format(session.attr("userName"), session.attr("password"));
                    headers['Authorization'] = 'basic {0}'.format(btoa(creds));
                    try {
                        $.ajax({
                            url: "{0}/Sessions".format(services.main.baseUrl),
                            async: true,
                            contentType: 'application/json',
                            headers: headers,
                            method: 'POST',
                            crossDomain: true,
                            success: function(resp) {
                                this.session.attr("sessionId", resp.SessionId);
                                this.session.attr("userName", resp.UserId);
                                this.session.attr("userId", resp.Username);
                                this.session.attr("userLang", resp.UserLanguage);
                                this.session.attr("lastRequest", resp.LastRequest);
                                if (onsuccess) {
                                    onsuccess();
                                }
                            },
                            error: function(resp) {
                                this.session.attr("sessionId", "");
                                this.session.attr("userName", "");
                                this.session.attr("userId", "");
                                this.session.attr("userLang", "");
                                this.session.attr("lastRequest", "");
                                console.error(resp);
                                if (onerror) {
                                    onerror();
                                }
                            }
                        });
                    } catch (x) {
                        console.error(x);
                    }
                },
                save: function(storage) {
                    storage.set('__session', JSON.stringify(this.session));
                },
                load: function(storage) {
                    var r = storage.get('__session');
                    this.session = new can.Map(JSON.parse(r));
                },
                appendHeaders: function(apiHeaders) {
                    var headers = apiHeaders || {};
                    headers['session-id'] = this.session.attr("sessionId");
                    return headers;
                }
            });

            app.utils.namespace("models", app).Session = SessionModel;
        });