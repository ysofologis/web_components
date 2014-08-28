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

+function(config, since) {
    describe("RESOURCE --> Sessions", function() {
        var services = config.get('services');
        var resources = config.get('resources');
        for (var ix = 0; ix < services.length; ix++) {
            var serviceConf = services[ix];
            var apiUrl = serviceConf.baseUrl + resources.sessions.path;
            // protect closue references inside loop
            +function(apiUrl) {
                var productInfo = null;
                var req = new AjaxRequest({
                    url: apiUrl,
                    success: function(data) {
                        productInfo = data;
                    }
                });
                it("should return product info from [" + apiUrl + "]", function() {
                    runs(function() {
                        req.execute();
                    });
                    waitsFor(function() {
                        return req.isCompleted();
                    }, "request completed", 2500);
                    runs(function() {
                        since("http status must be 200").
                                expect(req.status()).toEqual(200);
                        since("product info should not be null").
                                expect(productInfo).not.toBe(null);
                    });
                });
                it("should contains the version attribute", function() {
                    since("product info should contain version attribute").
                            expect(productInfo.Version).toBeDefined();
                });
            }(apiUrl);
        }
    });
}(appConfig, since);

