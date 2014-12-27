'use strict';

describe('Service: webSocket', function () {

  // load the service's module
  beforeEach(module('ngTasty.service.webSocket'));

  // instantiate service
  var webSocket, tastyWs;
  beforeEach(inject(function (_webSocket_) {
    webSocket = _webSocket_;
    tastyWs = new webSocket('ws://localhost:3000');
  }));

  it('should do something', function () {
    expect(!!webSocket).toBe(true);
  });

  it('should have `on` and `send` methods', function () {
    expect(tastyWs.on).toBeDefined();
    expect(tastyWs.send).toBeDefined();
  });
  
});
