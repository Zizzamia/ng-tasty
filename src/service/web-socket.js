/**
 * @ngdoc service
 * @name ngTasty.service.webSocket
 * @description
 * # webSocket
 * Factory in ngTasty.
 */
angular.module('ngTasty.service.webSocket', [])
.factory('webSocket', function() {
  return function(url) {
    var blobURL = URL.createObjectURL(new Blob(['(', function() {
      var WSWorker = (function() {
        var _ws;

        var initialize = function(url) {
          _ws = new WebSocket(url);
        };

        var on = function(event) {
          _ws.onmessage = function(response) {
            var data = JSON.parse(response.data);
            self.postMessage(data);
          };
        };

        var send = function(data) {
          _ws.send(data);
        };

        return {
          initialize: initialize,
          on: on,
          send: send
        };

      })();

      self.addEventListener('message', function(e) {
        switch (e.data.cmd) {
          case 'ws_new':
            WSWorker.initialize(e.data.url);
            break;
          case 'ws_on':
            WSWorker.on(e.data.event, e.data.cb);
            break;
          case 'ws_send':
            WSWorker.send(JSON.stringify(e.data.data));
            break;
          default:
            console.log('Unknown command: ' + e.data.cmd);
          }
      });

    }.toString(), ')()'], { type: 'application/javascript' }));

    var _worker = new Worker(blobURL);
    URL.revokeObjectURL(blobURL);

    _worker.postMessage({ cmd: 'ws_new', url: url });

    return {
      on: function(event, cb) {
        _worker.postMessage({ cmd: 'ws_on' });
        _worker.addEventListener('message', function(e) {
          if (event === 'all' || e.data.type === event) {
            cb(e.data);
          } 
        });
      },
      send: function(data) {
        _worker.postMessage({ cmd: 'ws_send', data: data });
      }
    };
  };
});
