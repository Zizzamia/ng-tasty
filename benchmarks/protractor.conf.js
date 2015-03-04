var httpServer = require('http-server');

exports.config = {
  directConnect: true,

  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      //Important in order for benchpress to be able to force garbage collection, if desired
      'args': ['--js-flags=--expose-gc'],
      //Important for benchpress to get timeline data from the browser
      'perfLoggingPrefs': {
        'traceCategories': 'blink.console,disabled-by-default-devtools.timeline'
      }
    },
    loggingPrefs: {
      performance: 'ALL'
    }
  },

  specs: ['**/benchmark.spec.js'],
  framework: 'jasmine2',

  beforeLaunch: function () {
    var server = httpServer.createServer({
      showDir: false
    });
    server.listen('8080', 'localhost', function() {
      var uri = 'http://localhos:8080';
      console.log('Starting up http-server, serving '
        + server.root
        + ' on: '
        + uri);
    });
  },

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  },
};