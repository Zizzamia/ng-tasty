describe('Service: debounce', function () {
  
  // load the service's module
  beforeEach(module('ngTasty.service.debounce'));

  // instantiate service
  var debounce, $timeout;
  beforeEach(inject(function (_debounce_, _$timeout_) {
    debounce = _debounce_;
    $timeout = _$timeout_;
  }));

  it('should do something"', function () {
    expect(!!debounce).toBe(true);
  });

  it('shouldnt execute immediately', function(){
    var count = 0;
    var plus = debounce(function(){
      count += 1;
    }, 100);
    expect(count).toBe(0);
    plus();
    expect(count).toBe(0);
  });

  it('should execute after delay', function(){
    var count = 0;
    var plus = debounce(function(){
      count += 1;
    }, 200);
    plus();
    expect(count).toBe(0);
    $timeout.flush(200);
    expect(count).toBe(1);
  });

  it('should only happen once', function(){
    var count = 0;
    var plus = debounce(function(){
      count += 1;
    }, 200);
    plus();
    plus();
    plus();
    plus();
    expect(count).toBe(0);
    $timeout.flush(200);
    expect(count).toBe(1);
    plus();
    plus();
    plus();
    $timeout.flush(200);
    expect(count).toBe(2);
  });

  it('can debounce independent functions', function(){
    var countOne = 0;
    var countTwo = 0;
    var plusOne = debounce(function(){
      countOne += 1;
    }, 200);
    var plusTwo = debounce(function(){
      countTwo += 1;
    }, 100);
    plusOne();
    plusTwo();
    $timeout.flush(100);
    plusOne();
    plusTwo();
    $timeout.flush(200);
    expect(countOne).toBe(1);
    expect(countTwo).toBe(2);
  });

  it('should execute trigger the function on the trailing edge', function(){
    var letters = 'abcdefg';
    var word = '';
    var addLetter = debounce(function(indexLetters){
      word += letters[indexLetters];
    }, 100);
    addLetter(0);
    addLetter(1);
    addLetter(2);
    $timeout.flush(200);
    expect(word).toBe('c');
  });

  it('should execute trigger the function on the leading edge', function(){
    var letters = 'abcdefg';
    var word = '';
    var addLetter = debounce(function(indexLetters){
      word += letters[indexLetters];
    }, 100, true);
    addLetter(0);
    addLetter(1);
    addLetter(2);
    $timeout.flush(200);
    expect(word).toBe('a');
  });
});