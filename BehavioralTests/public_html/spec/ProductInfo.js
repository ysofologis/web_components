/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

+function(config, expect) {
    describe("Product Information", function() {
        var services = config.get('services');
        var resources = config.get('resources');
        for (var ix = 0; ix < services.length; ix++) {
            var serviceConf = services[ix];
            var apiUrl = serviceConf.baseUrl + resources.productinfo.path;
            it("should return product info from [" + apiUrl + "]", function() {
                var productInfo = null;
                var req = new AjaxRequest({
                    url: apiUrl,
                    success: function(data) {
                        productInfo = data;
                    }
                });
                runs(function() {
                    req.execute();
                });
                waitsFor(function() {
                    return req.isCompleted();
                }, "request completed", 2500);
                runs(function() {
                    expect(req.status()).equalTo(202);
                    expect(productInfo).not.toBe(null);
                });
            });
        }
    });
}(appConfig, expect);

