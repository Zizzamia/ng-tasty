"use strict";

describe("Directive", function () {

  describe("tastyTable complete", function () {
    var $scope, element, 
    createDirective, elementSelected;

    beforeEach(module('tastyTable'));

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

    it("should ..", function () {
      expect(true).toEqual(true);
    });
  });
});
