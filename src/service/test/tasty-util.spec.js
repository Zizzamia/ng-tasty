describe('Service tastyUtil', function () {
  'use strict';
  var tastyUtil;

  beforeEach(module('ngTasty.service.tastyUtil'));
  
  beforeEach(function () {
    inject(function (_tastyUtil_) {
      tastyUtil = _tastyUtil_;
    });
  });

  it('should be service"', function () {
    expect(tastyUtil).not.toBeNull();
  });

  it('should be contain the debounce service"', function () {
    expect(tastyUtil.debounce).not.toBeNull();
  });

  it('should be contain the setProperty service"', function () {
    expect(tastyUtil.setProperty).not.toBeNull();
  });

  it('should be contain the joinObjects service"', function () {
    expect(tastyUtil.joinObjects).not.toBeNull();
  });
});