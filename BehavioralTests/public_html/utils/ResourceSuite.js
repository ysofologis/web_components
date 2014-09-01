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
var resourceSuite = (function(app, config, since) {
    function callResource(resourceName, method, httpStatus) {
        describe("RESOURCE --> {0}".format(resourceName), function() {
            var services = config.get('services');
            var resources = config.get('resources');
            var login = config.get('login');
            
            for (var ix = 0; ix < services.length; ix++) {
                var serviceConf = services[ix];
                var apiUrl = serviceConf.baseUrl + "api/" + resourceName;
                // protect closure references inside loop
                +function(apiUrl, serviceConf) {
                    var sessionInfo = null;
                    var req = new ApiRequest({
                        url: apiUrl,
                        type: method,
                        success: function(data) {
                            sessionInfo = data;
                            console.log("[{0}] --> SUCCESS".format(apiUrl));
                        }
                    });
                    it("it should be able call resource", function() {
                        runs(function() {
                            req.execute( app.getSessionId(serviceConf.name) );
                        });
                        
                        waitsFor(function() {
                            return req.isCompleted();
                        }, "request completed", 5000 );
                        
                        runs(function() {
                            since( "http status must be {0}".format(httpStatus) ).
                                    expect( req.status() ).toEqual(httpStatus);
                        });
                    });
                }(apiUrl, serviceConf);
            }
        });
    }
    
    return {
        execute : callResource
    };
})(appState, appConfig, since);
