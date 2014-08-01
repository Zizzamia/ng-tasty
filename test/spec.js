"use strict";

describe("Directive", function () {

  describe("tastyTable", function () {
    var $rootScope, $scope, $compile;
    var element, createDirective, elementSelected;

    beforeEach(module('tastyTable'));

    beforeEach(inject(function (_$rootScope_, _$compile_) {
      $rootScope = _$rootScope_;
      $compile = _$compile_;
      element = angular.element(''+
      '<table tasty-table>'+
      '</table>');
      $compile(element)($rootScope);
      $rootScope.pagination = {};
      $rootScope.resourceQuery = {};
      $rootScope.$digest();
    }));

    it("should ..", function () {
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
      '<table tasty-table>'+
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
      element = angular.element(''+
      '<div tasty-table>'+
      ' <table>'+
      '   <thead tasty-thead></thead>'+
      ' </table>'+
      ' <div tasty-table-pagination></div>'+
      '</div>');
      $compile(element)($rootScope);
      $rootScope.pagination = {};
      $rootScope.resourceQuery = {};
      $rootScope.$digest();
    }));
  });
});
