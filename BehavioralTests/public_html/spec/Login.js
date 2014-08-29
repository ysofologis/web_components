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
            var username = login.default.user;
            var password = login.default.password;
            var headers = {};
            headers['authorization'] = 'basic ' + btoa('{0}:{1}'.format(username, password));
            // protect closue references inside loop
            +function(apiUrl, headers) {
                var sessionInfo = null;
                var req = new ApiRequest({
                    url: apiUrl,
                    type: 'POST',
                    headers: headers,
                    success: function(data) {
                        sessionInfo = data;
                        app.setSession(sessionInfo);
                    }
                });
                it("should be able to login for user '{0}' at [{1}]".format(username, apiUrl), function() {

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
                });
            }(apiUrl, headers);
        }
    });
}(appState, appConfig, expect, since);

