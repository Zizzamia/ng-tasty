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
    /**
     * Creates a String[1] representing a binary blob[2] function 
     * containing the WebSocket Factory API.
     *
     * [1]: https://developer.mozilla.org/en-US/docs/Web/API/URL.createObjectURL
     * [2]: https://developer.mozilla.org/en-US/docs/Web/API/Blob
     * 
     * @return {string}   String containing the encoded script
     */
    var blobURL = URL.createObjectURL(new Blob(['(', function() {
      var WSWorker = (function() {
        var _ws;

        /**
         * Initialize a new WebSocket using
         * the provided URL parameters.
         * 
         * @param  {string} url The WebSocket URL
         */
        var initialize = function(url) {
          _ws = new WebSocket(url);
        };

        /**
         * Listens for any message coming from the WebSocket
         * and send its content to the main JS thread using postMessage[1].
         *
         * [1]: https://developer.mozilla.org/en-US/docs/Web/API/Worker.postMessage
         * 
         */
        var on = function() {
          _ws.onmessage = function(response) {
            var data = JSON.parse(response.data);
            self.postMessage(data);
          };
        };

        /**
         * Sends data to the WebSocket.
         * 
         * @param  {string} data
         */
        var send = function(data) {
          _ws.send(data);
        };

        return {
          initialize: initialize,
          on: on,
          send: send
        };

      })();

      /**
       * Listens for incoming messages from the main
       * JavaScript Thread.
       *
       * The commands allowed are:
       *
       * ws_new  ~> Calls initialize on the Web Socket Worker
       * ws_on   ~> Register the supplied callback
       * ws_send ~> Sends a message to the underlying WebSocket
       *            encoding it as a string (JSON.stringify)
       *            
       */
      self.addEventListener('message', function(e) {
        switch (e.data.cmd) {
          case 'ws_new':
            WSWorker.initialize(e.data.url);
            break;
          case 'ws_on':
            WSWorker.on();
            break;
          case 'ws_send':
            WSWorker.send(JSON.stringify(e.data.data));
            break;
          default:
            console.log('Unknown command: ' + e.data.cmd);
          }
      });

    }.toString(), ')()'], { type: 'application/javascript' }));
    

    // Create a new WebSocket Worker, revoke the URL since
    // it's not useful anymore.
    var _worker = new Worker(blobURL);
    URL.revokeObjectURL(blobURL);

    // Tell the WebSocket Worker to init a new WebSocket
    _worker.postMessage({ cmd: 'ws_new', url: url });


    return {
      /**
       * Registers a callback to a specific Worker event listener.
       * There are two different events:
       *
       * - 'all' ~> subscribes to all websocket messages
       * - 'type'~> subscribes to all websocket messages containing
       *            a field named 'type'.
       *
       * For example, WebSockets Server events like this one:
       *
       * {
       *   'type': 'tweet',
       *   'data': ...
       * }
       *
       * can be handled in the following way:
       *
       *  ws.on('twitter', function(data) {
       *      ...
       *  });
       *  
       * @param  {string}   event The event name
       * @param  {Function} cb    Callback with output data (first param)
       */
      on: function(event, cb) {
        _worker.postMessage({ cmd: 'ws_on' });
        _worker.addEventListener('message', function(e) {
          if (event === 'all' || e.data.type === event) {
            cb(e.data);
          } 
        });
      },
      /**
       * Sends data to the WebSocket.
       * 
       * @param  {Any} data
       */
      send: function(data) {
        _worker.postMessage({ cmd: 'ws_send', data: data });
      }
    };
  };
});
