describe('Directive', function () {
  'use strict';

  beforeEach(module('ngMock'));
  beforeEach(module('ngTasty.table'));
  beforeEach(module('template/table/tasty-head.html'));
  beforeEach(module('template/table/tasty-pagination.html'));

  describe('ngTasty table complete', function () {
    var $scope, $timeout, $httpBackend, element, params, 
    urlToCall, filters, createDirective, 
    elementSelected, expected;

    beforeEach(inject(function ($rootScope, $compile, $http, _$httpBackend_, _$timeout_) {
      $scope = $rootScope;
      $timeout = _$timeout_;
      $httpBackend = _$httpBackend_;
      $scope.getResource = function (params) {
        return $http.get('api.json?'+params).then(function (response) {
          return {
            'rows': response.data.rows,
            'header': response.data.header,
            'pagination': response.data.pagination,
            'sortBy': response.data['sort-by'],
            'sortOrder': response.data['sort-order']
          };
        });
      };
      $scope.filters = {
        'city': 'sf'
      };
      element = angular.element(''+
      '<div tasty-table resource="getResource" filters="filters">'+
      '  <table>'+
      '    <thead tasty-thead></thead>'+
      '    <tbody>'+
      '      <tr ng-repeat="row in rows">'+
      '        <td>{{ row.name }}</td>'+
      '        <td>{{ row.star }}</td>'+
      '        <td>{{ row[\'sf-location\'] }}</td>'+
      '      </tr>'+
      '    </tbody>'+
      '  </table>'+
      '  <div tasty-pagination></div>'+
      '</div>');
      $compile(element)($rootScope);
      $rootScope.$digest();
    }));

    it('should have these element.scope() value as default', function () {
      //console.log($scope)
      expect(element.scope().query).toEqual({
        'page': 'page',
        'count': 'count',
        'sortBy': 'sort-by',
        'sortOrder': 'sort-order',
      });
      expect(element.scope().header).toEqual({
        'columns': []
      });
      expect(element.scope().rows).toEqual([]);
      expect(element.scope().params).toEqual({ 
        sortBy : undefined, 
        sortOrder : 'asc', 
        page : 1, 
        count : 5, 
        thead : true, 
        pagination : true 
      });
      expect(element.scope().thead).toEqual(true);
      expect(element.scope().pagination).toEqual(true);
      expect(element.scope().resourcePagination).toEqual({});
      expect(element.scope().url).toEqual('');
    });

    //it('should return the right url after called buildUrl', function () {
    //  urlToCall = 'api.json?sort-order=asc&page=1&count=5&city=sf';
    //  $httpBackend.whenGET(urlToCall).respond({});
    //  $timeout.flush();
    //  $httpBackend.flush();
    //});
  });
  
  describe('ngTasty table withs sorting', function () {
    var $scope, element, params, filters, 
    createDirective, elementSelected, expected;

    beforeEach(inject(function ($rootScope, $compile) {
      $scope = $rootScope;
      $scope.getResource = function (params) {
      };
      element = angular.element(''+
      '<table tasty-table resource="getResource">'+
      '  <thead tasty-thead></thead>'+
      '  <tbody>'+
      '    <tr ng-repeat="row in rows">'+
      '      <td>{{ row.name }}</td>'+
      '      <td>{{ row.star }}</td>'+
      '      <td>{{ row[\'sf-location\'] }}</td>'+
      '    </tr>'+
      '  </tbody>'+
      '</table>');
      $compile(element)($rootScope);
      $rootScope.$digest();
    }));

    it('should have these element.scope() value as default', function () {
      //console.log($scope)
      expect(element.scope().query).toEqual({
        'page': 'page',
        'count': 'count',
        'sortBy': 'sort-by',
        'sortOrder': 'sort-order',
      });
      expect(element.scope().header).toEqual({
        'columns': []
      });
      expect(element.scope().rows).toEqual([]);
      expect(element.scope().params).toEqual({ 
        sortBy : undefined, 
        sortOrder : 'asc', 
        page : 1, 
        count : 5, 
        thead : true 
      });
      expect(element.scope().thead).toEqual(true);
      expect(element.scope().pagination).toEqual(false);
      expect(element.scope().resourcePagination).toEqual({});
      expect(element.scope().url).toEqual('');
    });
  });

  describe('ngTasty table with pagination', function () {
    var $scope, element, params, filters, 
    createDirective, elementSelected, expected;

    beforeEach(inject(function ($rootScope, $compile) {
      $scope = $rootScope;
      $scope.getResource = function (params) {
      };
      element = angular.element(''+
      '<div tasty-table resource="getResource">'+
      '  <table>'+
      '    <thead>'+
      '      <tr>'+
      '        <th>Name</th>'+
      '        <th>Star</th>'+
      '        <th>SF Location</th>'+
      '      </tr>'+
      '    </thead>'+
      '    <tbody>'+
      '      <tr ng-repeat="row in rows">'+
      '        <td>{{ row.name }}</td>'+
      '        <td>{{ row.star }}</td>'+
      '        <td>{{ row[\'sf-location\'] }}</td>'+
      '      </tr>'+
      '    </tbody>'+
      '  </table>'+
      '  <div tasty-pagination></div>'+
      '</div>');
      $compile(element)($rootScope);
      $rootScope.$digest();
    }));

    it('should have these element.scope() value as default', function () {
      //console.log($scope)
      expect(element.scope().query).toEqual({
        'page': 'page',
        'count': 'count',
        'sortBy': 'sort-by',
        'sortOrder': 'sort-order',
      });
      expect(element.scope().header).toEqual({
        'columns': []
      });
      expect(element.scope().rows).toEqual([]);
      expect(element.scope().params).toEqual({ 
        sortBy : undefined, 
        sortOrder : 'asc', 
        page : 1, 
        count : 5, 
        pagination : true 
      });
      expect(element.scope().thead).toEqual(false);
      expect(element.scope().pagination).toEqual(true);
      expect(element.scope().resourcePagination).toEqual({});
      expect(element.scope().url).toEqual('');
    });
  });

  describe('ngTasty table with filtes', function () {
    var $scope, element, params, filters, 
    createDirective, elementSelected, expected;

    beforeEach(inject(function ($rootScope, $compile) {
      $scope = $rootScope;
      $scope.getResource = function (params) {
      };
      $scope.filters = {
        'city': 'sf'
      };
      element = angular.element(''+
      '<div tasty-table resource="getResource" filters="filters">'+
      '  <table>'+
      '    <thead>'+
      '      <tr>'+
      '        <th>Name</th>'+
      '        <th>Star</th>'+
      '        <th>SF Location</th>'+
      '      </tr>'+
      '    </thead>'+
      '    <tbody>'+
      '      <tr ng-repeat="row in rows">'+
      '        <td>{{ row.name }}</td>'+
      '        <td>{{ row.star }}</td>'+
      '        <td>{{ row[\'sf-location\'] }}</td>'+
      '      </tr>'+
      '    </tbody>'+
      '  </table>'+
      '</div>');
      $compile(element)($rootScope);
      $rootScope.$digest();
    }));

    it('should have these element.scope() value as default', function () {
      //console.log($scope)
      expect(element.scope().query).toEqual({
        'page': 'page',
        'count': 'count',
        'sortBy': 'sort-by',
        'sortOrder': 'sort-order',
      });
      expect(element.scope().header).toEqual({
        'columns': []
      });
      expect(element.scope().rows).toEqual([]);
      expect(element.scope().params).toEqual({ 
        sortBy : undefined, 
        sortOrder : 'asc', 
        page : 1, 
        count : 5 
      });
      expect(element.scope().thead).toEqual(false);
      expect(element.scope().pagination).toEqual(false);
      expect(element.scope().resourcePagination).toEqual({});
      expect(element.scope().url).toEqual('');
    });
  });
});
