describe('Service', function () {
  'use strict';

  beforeEach(module('ngTasty.service'));

  describe('debounce', function() {
    var debounce;

    beforeEach(function () {
      inject(function (_debounce_) {
        debounce = _debounce_;
      });
    });

    it('shoule be service"', function () {
      expect(debounce).not.toBeNull();
    });
  });

  describe('setProperty', function() {
    var setProperty;

    beforeEach(function () {
      inject(function (_setProperty_) {
        setProperty = _setProperty_;
      });
    });

    it('shoule be service', function () {
      expect(setProperty).not.toBeNull();
    });
  });

  describe('joinObjects', function() {
    var joinObjects;

    beforeEach(function () {
      inject(function (_joinObjects_) {
        joinObjects = _joinObjects_;
      });
    });

    it('shoule be service', function () {
      expect(joinObjects).not.toBeNull();
    });
  });
});