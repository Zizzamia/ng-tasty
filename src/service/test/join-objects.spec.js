describe('Service', function () {
  'use strict';

  beforeEach(module('ngTasty.service.joinObjects'));

  describe('joinObjects', function() {
    var joinObjects;

    beforeEach(function () {
      inject(function (_joinObjects_) {
        joinObjects = _joinObjects_;
      });
    });

    it('should be service', function () {
      expect(joinObjects).not.toBeNull();
    });
  });
});