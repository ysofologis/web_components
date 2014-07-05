/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


define(['text!config/services.json',
    'app/constants','app/eventhub', 'app/storage',
    'bootstrap'], function(services, constants, eventHub, storage) {
   var app = {
       config: {
           services : JSON.parse(services)
       },
       constants: constants,
       eventHub: eventHub,
       storage: storage
   }; 
   return app;
});