describe('Service: joinObjects', function () {
  
  // load the service's module
  beforeEach(module('ngTasty.service.joinObjects'));

  // instantiate service
  var joinObjects;
  beforeEach(inject(function (_joinObjects_) {
    joinObjects = _joinObjects_;
  }));

  it('should do something', function () {
    expect(!!joinObjects).toBe(true);
  });

});
