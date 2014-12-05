describe('Service', function () {
  'use strict';

  beforeEach(module('ngTasty.service.debounce'));

  describe('debounce', function() {
    var debounce;

    beforeEach(function () {
      inject(function (_debounce_) {
        debounce = _debounce_;
      });
    });

    it('should be service"', function () {
      expect(debounce).not.toBeNull();
    });
  });
});