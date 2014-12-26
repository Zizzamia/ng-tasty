describe('Service joinObjects', function () {
  'use strict';
  var joinObjects;

  beforeEach(module('ngTasty.service.joinObjects'));

  beforeEach(function () {
    inject(function (_joinObjects_) {
      joinObjects = _joinObjects_;
    });
  });

  it('should be service', function () {
    expect(joinObjects).not.toBeNull();
  });
});