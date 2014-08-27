/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var AjaxRequest = function(req) {
    var that = this;
    var _completed = false;
    var _result = null;
    var _status = 0;
    var _data = null;
    that.isCompleted = function() {
      return _completed;  
    };
    that.result = function() {
      return _result;  
    };
    that.status = function() {
      return _status;  
    };
    that.data = function() {
      return _data;  
    };
    var origSuccess = req.success || function(data) {};
    req.success = function(data, respText, xhr) {
        origSuccess(data);
        _data = data;
        _status = xhr.status;
        _completed = true;
    };
    var origError = req.error || function(xhr) {};
    req.error = function(xhr) {
        origError(xhr);
        _status = xhr.status;
        _completed = true;
    };
    req.crossDomain = true;
    that.execute = function() {
        $.ajax(req);
    };
};
