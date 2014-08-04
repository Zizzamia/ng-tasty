describe('Directive', function () {
  'use strict';

  describe('ngTasty table complete', function () {
    var $scope, element, 
    createDirective, elementSelected;

    beforeEach(module('ngTasty.table'));

    beforeEach(inject(function ($rootScope, $compile) {
      $scope = $rootScope;
      $scope.getResource = function () {
      };
      element = angular.element(''+
      '<table tasty-table resource="getResource">'+
      '</table>');
      $compile(element)($scope);
      $scope.$digest();
    }));

    it('should ..', function () {
      expect(true).toEqual(true);
    });
  });
});
