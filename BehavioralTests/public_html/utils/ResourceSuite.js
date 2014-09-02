/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var ResourceSuite = (function(console, app, config) {
    return function(it, expect, since) {
        function callResource(resourceName, method, assertion, lastCall) {
            var _completed = false;
            var _callInfo = {
                description: "RESOURCE --> {0}".format(resourceName),
                completed: function() {
                    return _completed;
                }
            };
            describe(_callInfo.description, function() {
                var services = config.get('services');
                for (var ix = 0; ix < services.length; ix++) {
                    var serviceConf = services[ix];
                    var apiUrl = serviceConf.baseUrl + "api/" + resourceName;
                    // protect closure references inside loop
                    +function(apiUrl, serviceConf) {
                        var resp = null;
                        var req = new ApiRequest({
                            url: apiUrl,
                            type: method,
                            success: function(data) {
                                resp = data;
                                console.log("[{0}] --> SUCCESS".format(apiUrl));
                            }
                        });
                        it(assertion.description, function() {
                            if (lastCall) {
                                waitsFor(function() {
                                    return lastCall.completed();
                                });
                            }
                            assertion.callback(serviceConf, req, resp);
                        });
                    }(apiUrl, serviceConf);
                }
                _completed = true;
            });
            return _callInfo;
        }

        function login() {
            function serviceLogin(serviceConf, creds, completed) {
                var sessionId = app.getSessionId(serviceConf.name);
                if (sessionId === null) {
                    var apiUrl = serviceConf.baseUrl + "api/Sessions";
                    var sessionInfo = null;
                    var headers = {};
                    headers['authorization'] = 'basic ' + btoa('{0}:{1}'.format(creds.user, creds.password));
                    var req = new ApiRequest({
                        url: apiUrl,
                        type: 'POST',
                        headers: headers,
                        success: function(data) {
                            app.setSession(serviceConf.name, data);
                            sessionInfo = data;
                        }
                    });
                    it("should be able to login for user '{0}' at [{1}]".format(creds.user, apiUrl), function() {
                        runs(function() {
                            req.execute();
                        });
                        waitsFor(function() {
                            return sessionInfo !== null;
                        }, "request completed", 2500);
                        runs(function() {
                            since("http status must be 200").
                                    expect(req.status()).toEqual(200);
                            since("session info should not be null").
                                    expect(sessionInfo).not.toBe(null);
                        });
                    });
                    it("should contains the SessionId attribute", function() {
                        expect(sessionInfo.SessionId).toBeDefined();
                        if (completed) {
                            completed();
                        }
                    });
                }
            }

            var services = config.get('services');
            var login = config.get('login');
            var _completed = 0;
            describe("LOGIN", function() {
                for (var ix = 0; ix < services.length; ix++) {
                    var serviceConf = services[ix];
                    serviceLogin(serviceConf, login.default, function() {
                        _completed++;
                    });
                }
            });
            return {
                completed: function() {
                    _completed === services.length;
                }
            };
        }

        function logout(lastCall) {
            function serviceLogout(serviceConf, completed) {
                var apiUrl = serviceConf.baseUrl + "/api/Sessions";
                var headers = {};
                var sessionId = app.getSessionId(serviceConf.name);
                if (sessionId !== null) {
                    headers['session-id'] = sessionId;
                    var loggedOut = false;
                    var req = new ApiRequest({
                        url: apiUrl + "/" + app.getSessionId(serviceConf.name),
                        type: 'DELETE',
                        headers: headers,
                        success: function(data) {
                            app.setSession(serviceConf.name, null);
                            loggedOut = true;
                        }
                    });
                    it("should be able to logout at [{0}]".format(apiUrl), function() {
                        if (lastCall) {
                            waitsFor(function() {
                                return lastCall.completed();
                            });
                        }
                        runs(function() {
                            req.execute();
                        });
                        waitsFor(function() {
                            return loggedOut;
                        }, "request completed", 2500);
                        runs(function() {
                            since("http status must be 200").
                                    expect(req.status()).toEqual(200);
                            if (completed) {
                                completed();
                            }
                        });
                    });
                }
            }

            var services = config.get('services');
            var _completed = 0;
            describe("LOGOUT", function() {
                for (var ix = 0; ix < services.length; ix++) {
                    var serviceConf = services[ix];
                    serviceLogout(serviceConf, function() {
                        _completed++;
                    });
                }
            });
            return {
                completed: function() {
                    _completed === services.length;
                }
            };
        }

        return {
            login: login,
            execute: callResource,
            logout: logout
        };
    };

})(console, appState, appConfig);
