describe('Service, webSocket', function () {
  'use strict';
  var webSocket, tastyWs;

  beforeEach(module('ngTasty.service.webSocket'));

  beforeEach(function () {
    inject(function (_webSocket_) {
      webSocket = _webSocket_;
      tastyWs = new webSocket('ws://localhost:3000');
    });
  });

  it('should be service"', function () {
    expect(webSocket).not.toBeNull();
  });

  it('should have `on` and `send` methods', function () {
    expect(tastyWs.on).toBeDefined();
    expect(tastyWs.send).toBeDefined();
  });
});