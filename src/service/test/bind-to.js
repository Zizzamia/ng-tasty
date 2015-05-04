describe('Service: bindTo', function () {
  
  // load the service's module
  beforeEach(module('ngTasty.service.bindTo'));

  // instantiate service
  var bindTo, $timeout;
  beforeEach(inject(function (_bindTo_) {
    bindTo = _bindTo_;
  }));

  it('should do something"', function () {
    expect(!!bindTo).toBe(true);
  });
});