describe('Service', function () {
  'use strict';

  beforeEach(module('ngTasty.service'));

  describe('tastyUtil', function() {
    var tastyUtil;

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


  describe('setProperty', function() {
    var setProperty, obj1, obj2, experctedObj;

    beforeEach(function () {
      inject(function (_setProperty_) {
        setProperty = _setProperty_;
      });
    });

    it('should be service', function () {
      expect(setProperty).not.toBeNull();
    });

    it('should return the origin object', function () {
      obj1 = {
        'name': 'Ritual Coffee Roasters',
        'sf-location': 'Hayes Valley'
      };
      obj2 = {
        'la-location': undefined,
        'ny-location': null
      };
      experctedObj = {
        'name': 'Ritual Coffee Roasters',
        'sf-location': 'Hayes Valley'
      };
      expect(setProperty(obj1, obj2, undefined)).toEqual(experctedObj);
      expect(setProperty(obj1, obj2, 'la-location')).toEqual(experctedObj);
      expect(setProperty(obj1, obj2, 'ny-location')).toEqual(experctedObj);
    });

    it('should return the origin object with the ney property set', function () {
      obj1 = {
        'name': 'Ritual Coffee Roasters',
        'sf-location': 'Hayes Valley'
      };
      obj2 = {
        'star': '★★★★★',
        'is-good': true,
        'is-in-new-york': false
      };
      expect(setProperty(obj1, obj2, 'star')).toEqual({
        'name': 'Ritual Coffee Roasters',
        'sf-location': 'Hayes Valley',
        'star': '★★★★★'
      });
      expect(setProperty(obj1, obj2, 'is-good')).toEqual({
        'name': 'Ritual Coffee Roasters',
        'sf-location': 'Hayes Valley',
        'star': '★★★★★',
        'is-good': true
      });
      expect(setProperty(obj1, obj2, 'is-in-new-york')).toEqual({
        'name': 'Ritual Coffee Roasters',
        'sf-location': 'Hayes Valley',
        'star': '★★★★★',
        'is-good': true,
        'is-in-new-york': false
      });
    });
  });


  describe('joinObjects', function() {
    var joinObjects;

    beforeEach(function () {
      inject(function (_joinObjects_) {
        joinObjects = _joinObjects_;
      });
    });

    it('should be service', function () {
      expect(joinObjects).not.toBeNull();
    });
  });
});