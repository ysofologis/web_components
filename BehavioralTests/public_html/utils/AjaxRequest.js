/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var AjaxRequest = (function($) {
    function AjaxWrapper(req) {
        var that = this;
        var _completed = false;
        var _result = null;
        var _status = 0;
        var _data = null;
        var _sessionInfo = null;
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
        var origSuccess = req.success || function(data) {
        };
        req.success = function(data, respText, xhr) {
            console.log(respText);
            origSuccess(data);
            _data = data;
            _status = xhr.status;
            _completed = true;
        };
        var origError = req.error || function(xhr) {
        };
        req.error = function(xhr) {
            origError(xhr);
            _status = xhr.status;
            _completed = true;
        };
        req.crossDomain = true;
        that.execute = function() {
            _completed = false;
            _status = -1;
            _data = null;
            if (_sessionInfo !== null) {
                var headers = req.headers || {};
                headers['session-id'] = _sessionInfo.SessionId;
                req.headers = headers;
            }
            $.ajax(req);
        };
        that.login = function(apiUrl, username, password, onsuccess, onerror) {
            var headers = {};
            headers['authorization'] = 'basic ' + btoa(username + ':' + password);
            _sessionInfo = null;
            $.ajax({
                url: apiUrl,
                type: 'POST',
                headers: headers,
                success: function(data) {
                    _sessionInfo = data;
                    if (onsuccess) {
                        onsuccess(data);
                    }
                },
                error: function(xhr) {
                    if (onerror) {
                        onerror(xhr);
                    }
                }
            });
        };
        that.hasSession = function() {
            return _sessionInfo !== null;
        };
    };
    return AjaxWrapper;
})(jQuery);
