describe('Filter', function () {
  'use strict';

  beforeEach(module('ngTasty.filter.cleanFieldName'));

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
});