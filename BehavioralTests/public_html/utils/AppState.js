/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var appState = (function() {
    var _sessionInfo = {};
    return {
        setSession: function(serviceName, session) {
            _sessionInfo[serviceName] = session;
        },
        getSessionId: function(serviceName) {
            return _sessionInfo[serviceName].SessionId;
        }
    };
})();