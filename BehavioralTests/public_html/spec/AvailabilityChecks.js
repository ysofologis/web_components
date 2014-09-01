/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

+function(resourceSuite) {
    resourceSuite.execute("users", "GET", 200);
    resourceSuite.execute("roles", "GET", 200);
    resourceSuite.execute("groups", "GET", 200);
    
}(resourceSuite);
