describe('Service', function () {
  'use strict';

  beforeEach(module('ngTasty.service.webSocket'));

  describe('webSocket', function() {
    var ws;

    beforeEach(function () {
      inject(function (webSocket) {
        ws = webSocket;
      });
    });

    it('should be service"', function () {
      expect(ws).not.toBeNull();
    });
  });
});