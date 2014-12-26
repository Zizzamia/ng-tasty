describe('Service setProperty', function () {
  'use strict';
  var setProperty, obj1, obj2, experctedObj;

  beforeEach(module('ngTasty.service.setProperty'));

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