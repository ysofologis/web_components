/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


define(['jquery', 'can', 'app/init', 'underscore',
    'text!config/topbar.json',
    'app/utils', 'models/base'],
        function($, can, app, _, topbarJson) {
            var services = app.config.services;
            var topbarConf = JSON.parse(topbarJson);
            var resourcesConf = _.findWhere(topbarConf.topItems, {name: 'resources'}).items;
            resourcesConf = _.map(resourcesConf, function(item, ix) {
                if (ix == resourcesConf.length - 1) {
                    item.isLast = true;
                } else {
                    item.isLast = false;
                }
                return item;
            });
            var proto = {
                session: {
                    sessionId: "",
                    // userName: "sysadmin",
                    userName: "alpha_212_bro_user1",
                    password: "PASSW0RD",
                    userId: "",
                    userLang: "",
                    lastRequest: ""
                },
                resources: resourcesConf,
                isLoggedIn: false,
                init: function() {
                    console.log();
                },
                updateSession: function(session) {
                    this.session.attr("sessionId", session.SessionId);
                    this.session.attr("userName", session.Username);
                    this.session.attr("userId", session.UserId);
                    this.session.attr("userLang", session.UserLanguage);
                    this.session.attr("lastRequest", session.LastRequest);
                    this.attr('isLoggedIn', session ? true : false);
                },
                login: function(model, elem, event) {
                    event.preventDefault();
                    var headers = {};
                    var that = this;
                    var session = that.attr("session");
                    var creds = '{0}:{1}'.format(session.attr("userName"), session.attr("password"));
                    headers['Authorization'] = 'basic {0}'.format(btoa(creds));
                    app.utils.startProgress();
                    $.ajax({
                        url: "{0}/Sessions".format(services.main.baseUrl),
                        async: true,
                        contentType: 'application/json',
                        headers: headers,
                        method: 'POST',
                        crossDomain: true,
                        success: function(resp) {
                            that.session.attr("sessionId", resp.SessionId);
                            that.session.attr("userName", resp.Username);
                            that.session.attr("userId", resp.UserId);
                            that.session.attr("userLang", resp.UserLanguage);
                            that.session.attr("lastRequest", resp.LastRequest);
                            that.attr('isLoggedIn', true);
                            app.utils.showInfo("Logged In!");
                            app.eventHub.publish(app.constants.events.USER_LOGGED_IN, resp);
                            app.utils.endProgress();
                        },
                        error: function(resp) {
                            app.utils.showError(resp.statusText);
                            that.attr('isLoggedIn', false);
                            that.session.attr("sessionId", "");
                            that.session.attr("userName", "");
                            that.session.attr("userId", "");
                            that.session.attr("userLang", "");
                            that.session.attr("lastRequest", "");
                            app.utils.endProgress();
                            console.error(resp);
                        }
                    });
                },
                logout: function(model, elem, event) {
                    event.preventDefault();
                    console.log();
                    var that = this;
                    app.utils.confirm("Are you sure you want to logout ?", function(result) {
                        if (result) {
                            app.utils.startProgress();
                            var headers = that.appendHeaders();
                            var sessionId = that.attr('session').attr('sessionId');
                            app.eventHub.publish("app-disconnected");
                            $.ajax({
                                url: "{0}/Sessions/{1}".format(services.main.baseUrl, sessionId),
                                async: true,
                                contentType: 'application/json',
                                headers: headers,
                                method: 'DELETE',
                                crossDomain: true,
                                success: function(resp) {
                                    that.attr('isLoggedIn', false);
                                    that.session.attr("sessionId", "");
                                    that.session.attr("userName", "");
                                    that.session.attr("userId", "");
                                    that.session.attr("userLang", "");
                                    that.session.attr("lastRequest", "");
                                    app.eventHub.publish(app.constants.events.USER_LOGGED_OUT);
                                    app.utils.showInfo("Logged Out!");
                                    app.utils.endProgress();
                                },
                                error: function(resp) {
                                    console.error(resp);
                                    app.utils.showError(resp.statusText);
                                    app.utils.endProgress();
                                }
                            });
                        }
                    });
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
            };
            app.utils.namespace("models", app).SessionModel = app.models.AppModel.extend(proto);
        });