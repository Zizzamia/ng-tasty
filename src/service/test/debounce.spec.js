describe('Service debounce', function () {
  'use strict';
  var debounce;

  beforeEach(module('ngTasty.service.debounce'));

  beforeEach(function () {
    inject(function (_debounce_) {
      debounce = _debounce_;
    });
  });

  it('should be service"', function () {
    expect(debounce).not.toBeNull();
  });
});