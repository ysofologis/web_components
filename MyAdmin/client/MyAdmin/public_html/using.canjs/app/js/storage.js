/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

define([], function() {
    function StorageEngine(storage) {
        this.save = function(key, obj) {
            var value = JSON.stringify(obj);
            storage.setItem(key, value);
        };
        this.load = function(key) {
            var value = storage.getItem(key);
            var obj = JSON.parse(value);
            return obj;
        };
        this.purge = function(key) {
            storage.removeItem(key);
        };
        this.clear = function() {
          storage.clear();  
        };
    }
    var storage = {
        local: new StorageEngine(window.localStorage),
        session: new StorageEngine(window.sessionStorage)
    };
    return storage;
});
