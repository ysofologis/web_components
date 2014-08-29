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

+function(app, config, expect, since) {
    describe("RESOURCE --> Sessions", function() {
        var services = config.get('services');
        var resources = config.get('resources');
        var login = config.get('login');

        for (var ix = 0; ix < services.length; ix++) {
            var serviceConf = services[ix];
            var apiUrl = serviceConf.baseUrl + resources.sessions.path;
            // protect closue references inside loop
            +function(serviceConf, apiUrl) {
                var loggedOut = false;
                var sessionId = app.getSessionId(serviceConf.name);
                if (sessionId !== null) {
                    var headers = {};
                    headers['session-id'] = sessionId;
                    var req = new ApiRequest({
                        url: apiUrl + "/" + app.getSessionId(serviceConf.name),
                        type: 'DELETE',
                        headers: headers,
                        success: function(data) {
                            loggedOut = true;
                            app.setSession(serviceConf.name, null);
                        }
                    });
                    it("should be able to logout for user '{0}' at [{1}]".format(username, apiUrl), function() {

                        runs(function() {
                            req.execute();
                        });

                        waitsFor(function() {
                            return loggedOut;
                        }, "request completed", 2500);

                        runs(function() {
                            since("http status must be 200").
                                    expect(req.status()).toEqual(200);
                        });
                    });
                }
            }(serviceConf, apiUrl);
        }
    });

}(appState, appConfig, expect, since);

