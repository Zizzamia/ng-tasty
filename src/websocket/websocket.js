angular.module('ngTasty.websocket', [
  'ngTasty.service'
])
.factory('WebSocket', function() {
  return function(url) {
    var _ws = new WebSocket(url);

    return {
      on: function(event, cb) {
        _ws.onmessage = function(response) {
          var data = JSON.parse(response.data);

          return data.type === event? cb(data) : null;
        };
      },
      send: function(data) {
	_ws.send(JSON.stringify(data));
      }
    };
  };
});
