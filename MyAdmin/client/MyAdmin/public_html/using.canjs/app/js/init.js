/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


define(['text!config/services.json'], function(services) {
   return {
       config: {
           services : JSON.parse(services)
       }
   }; 
});