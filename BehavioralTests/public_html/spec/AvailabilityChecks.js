/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

+function(suite) {
    suite.execute("users", "GET", 200);
    suite.execute("roles", "GET", 200);
    
}(resourceSuite);
