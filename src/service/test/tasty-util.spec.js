describe('Service: tastyUtil', function () {

  // load the service's module
  beforeEach(module('ngTasty.service.tastyUtil'));

  // instantiate service
  var tastyUtil;
  beforeEach(inject(function (_tastyUtil_) {
    tastyUtil = _tastyUtil_;
  }));

  it('should do something', function () {
    expect(!!tastyUtil).toBe(true);
  });

  it('should be contain the debounce service', function () {
    expect(tastyUtil.debounce).not.toBeNull();
  });

  it('should be contain the setProperty service', function () {
    expect(tastyUtil.setProperty).not.toBeNull();
  });

  it('should be contain the joinObjects service', function () {
    expect(tastyUtil.joinObjects).not.toBeNull();
  });

});
