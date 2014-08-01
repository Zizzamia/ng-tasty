"use strict";

describe("Directive", function () {

  describe("tastyTable", function () {
    var $scope, element, 
    createDirective, elementSelected;

    beforeEach(module('tastyTable'));

    beforeEach(inject(function ($rootScope, $compile) {
      $scope = $rootScope;
      element = angular.element(''+
      '<table tasty-table resource="getResource">'+
      '</table>');
      $compile(element)($scope);
      $scope.getResource = function () {
      };
      $scope.$digest();
    }));

    it("should ..", function () {
      console.log($scope)
      expect(true).toEqual(true);
    });

  });

  describe("tastyThead", function () {
    var $scope, $rootScope, $compile;
    var element, createDirective, elementSelected, field;

    beforeEach(module('tastyTable'));
    beforeEach(module('template/tasty-head.html'));

    beforeEach(inject(function (_$rootScope_, _$compile_) {
      $rootScope = _$rootScope_;
      $compile = _$compile_;
      element = angular.element(''+
      '<table>'+
      '  <thead tasty-thead></thead>'+
      '</table>');
      $compile(element)($rootScope);
      $rootScope.pagination = {};
      $rootScope.resourceQuery = {};
      $rootScope.$digest();
    }));
  });

  describe("tastyPagination", function () {
    var $rootScope, $scope, $compile;
    var element, createDirective, elementSelected;

    beforeEach(module('tastyTable'));
    beforeEach(module('../template/table-pagination.html'));

    beforeEach(inject(function (_$rootScope_, _$compile_) {
      $rootScope = _$rootScope_;
      $compile = _$compile_;
      element = angular.element('<div tasty-pagination></div>');
      $compile(element)($rootScope);
      $rootScope.pagination = {};
      $rootScope.resourceQuery = {};
      $rootScope.$digest();
    }));
  });
});
