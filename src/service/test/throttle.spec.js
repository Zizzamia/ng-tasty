describe('Service: throttle', function () {

  // load the service's module
  beforeEach(module('ngTasty.service.throttle'));

  // instantiate service
  var throttle, $timeout;
  beforeEach(inject(function (_throttle_, _$timeout_) {
    throttle = _throttle_;
    $timeout = _$timeout_;
  }));

  it('should do something', function () {
    expect(!!throttle).toBe(true);
  });

  it('shouldnt execute immediately', function(){
    var count = 0;
    var plus = throttle(function(){
      count += 1;
    }, 100);
    expect(count).toBe(0);
    plus();
    expect(count).toBe(1);
  });

  it('should execute after delay', function(){
    var count = 0;
    var plus = throttle(function(){
      count += 1;
    }, 200);
    plus();
    expect(count).toBe(1);
    plus();
    plus();
    plus();
    $timeout.flush(200);
    expect(count).toBe(2);
  });

  it('should only happen once every 200ms', function(){
    var count = 0;
    var plus = throttle(function(){
      count += 1;
    }, 200);
    plus();
    plus();
    plus();
    plus();
    expect(count).toBe(1);
    $timeout.flush(200);
    expect(count).toBe(2);
    plus();
    plus();
    plus();
    $timeout.flush(200);
    expect(count).toBe(3);
  });

  it('can throttle independent functions', function(){
    var countOne = 0;
    var countTwo = 0;
    var plusOne = throttle(function(){
      countOne += 1;
    }, 200);
    var plusTwo = throttle(function(){
      countTwo += 1;
    }, 100);
    plusOne();
    plusTwo();
    $timeout.flush(100);
    plusOne();
    plusTwo();
    $timeout.flush(200);
    expect(countOne).toBe(2);
    expect(countTwo).toBe(2);
  });
});
