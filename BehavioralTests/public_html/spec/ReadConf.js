/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
+function(config, expect) {
    describe("Configuration", function() {
        var services = null;
        var resources = null;
        config.get('services', function(data) {
            services = data;
        });
        config.get('resources', function(data) {
            resources = data;
        });
        it("should return services config", function() {
            expect(services).not.toBe(null);
        });
        it("should return resources config", function() {
            expect(resources).not.toBe(null);
        });
    });
}(appConfig, expect);
