/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

+function(app, ResourceSuite, it, expect, since) {
    function statusCodeAssertion(httpStatus) {
        var assetionCallback = function(serviceConf, req, resp) {
                runs(function() {
                    req.execute(app.getSessionId(serviceConf.name));
                });
                waitsFor(function() {
                    return req.isCompleted();
                }, "request completed", 5000);
                console.log(resp);
                runs(function() {
                    var actualStatus = req.status();
                    since("http status must be {0}".format(httpStatus)).
                            expect(actualStatus).toEqual(httpStatus);
                });
        };
        return {
            description: "resource path should be valid",
            callback : assetionCallback
        };
    }

        var resourceSuite = ResourceSuite(it, expect, since);
        
        var ciLogin = resourceSuite.login();
        resourceSuite.execute("users", "GET", statusCodeAssertion(200), ciLogin);
        resourceSuite.execute("roles", "GET", statusCodeAssertion(200));
        resourceSuite.execute("groups", "GET", statusCodeAssertion(200));
        resourceSuite.execute("languages", "GET", statusCodeAssertion(200));
        var ciLast = resourceSuite.execute("sessions", "GET", statusCodeAssertion(200));
        
        resourceSuite.logout(ciLast);

}(appState, ResourceSuite, it, expect, since);
