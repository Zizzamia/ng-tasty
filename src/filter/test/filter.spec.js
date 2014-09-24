describe('Filter', function () {
  'use strict';

  beforeEach(module('ngTasty.filter'));

  describe('cleanFieldName', function() {
    var cleanFieldName;

    beforeEach(function () {
      inject(function($filter) {
        cleanFieldName = $filter('cleanFieldName');
      });
    });

    it('has a cleanFieldName filter', function () {
      expect(cleanFieldName).not.toBeNull();
    });

    it('should return ...', function () {
      expect(cleanFieldName('SF Location')).toEqual('SF-Location');
    });
  });

  describe('filterInt', function() {
    var filterInt;

    beforeEach(function () {
      inject(function($filter) {
        filterInt = $filter('filterInt');
      });
    });

    it('has a filterInt filter', function () {
      expect(filterInt).not.toBeNull();
    });

    it('should return an integer when passing a number value', function () {
      expect(filterInt(10)).toBe(10);
      expect(filterInt('10')).toBe(10);
    });

    it('should return NaN when passing a not number value', function () {
      expect(filterInt('Not a number')).toBeNaN();
    });
  });

  describe('range', function() {
    var range;

    beforeEach(function () {
      inject(function($filter) {
        range = $filter('range');
      });
    });

    it('has a range filter', function () {
      expect(range).not.toBeNull();
    });

    it('should return the correct list when passing only the start value', function () {
      expect(range([], 4)).toEqual([0, 1, 2, 3]);
    });

    it('should return the correct list when passing the start and stop values', function () {
      expect(range([], 10)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect(range([], 3, 6)).toEqual([3, 4, 5]);
      expect(range([], 8, 2)).toEqual([]);
      expect(range([], 0)).toEqual([]);
    });

    it('should return the correct list when passing also the step value', function () {
      expect(range([], 0, 10, 2)).toEqual([0, 2, 4, 6, 8]);
      expect(range([], 10, 0, -1)).toEqual([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
      expect(range([], 8, 2, -2)).toEqual([8, 6, 4]);
      expect(range([], 8, 2, 2)).toEqual([]);
      expect(range([], 1, 5, -1)).toEqual([]);
    });
  });
});