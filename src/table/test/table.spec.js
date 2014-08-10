describe('Directive', function () {
  'use strict';
  var $scope, $timeout, $httpBackend, $compile;
  var element, params, urlToCall, filters, createDirective, 
  elementSelected, expected, completeJSON, sortingJSON, paginationJSON,
  filtersJSON;

  beforeEach(module('ngMock'));
  beforeEach(module('ngTasty.table'));
  beforeEach(module('mockedAPIResponse'));
  beforeEach(module('template/table/head.html'));
  beforeEach(module('template/table/pagination.html'));


  describe('ngTasty table configs', function () {
    beforeEach(inject(function ($rootScope, _$compile_) {
      $scope = $rootScope.$new();
      $compile = _$compile_;
    }));

    it('should return a throw message if the resource is not set', function () {
      function errorFunctionWrapper() {
        element = angular.element('<div tasty-table></div>');
        $compile(element)($scope);
        $scope.$digest();
      }
      expect(errorFunctionWrapper).toThrow('AngularJS tastyTable directive: miss the resource attribute');
    });

    it('should return a throw message if the resource set it\'s undefined', function () {
      function errorFunctionWrapper() {
        element = angular.element('<div tasty-table resource="getResource"></div>');
        $compile(element)($scope);
        $scope.$digest();
      }
      expected = 'AngularJS tastyTable directive: the resource (getResource) callback it\'s undefined'
      expect(errorFunctionWrapper).toThrow(expected);
    });
  });




  describe('ngTasty table complete', function () {
    beforeEach(inject(function ($rootScope, $compile, $http, _$httpBackend_, _$timeout_, _completeJSON_) {
      $scope = $rootScope.$new();
      $timeout = _$timeout_;
      $httpBackend = _$httpBackend_;
      completeJSON = _completeJSON_;
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
      $compile(element)($scope);
      $scope.$digest();
    }));

    it('should have these element.scope() value as default', function () {
      expect(element.scope().query).toEqual({
        'page': 'page',
        'count': 'count',
        'sortBy': 'sort-by',
        'sortOrder': 'sort-order',
      });
      expect(element.scope().url).toEqual('');
      expect(element.scope().header).toEqual({
        'columns': []
      });
      expect(element.scope().rows).toEqual([]);
      expect(element.scope().pagination).toEqual({});
      expect(element.scope().params).toEqual({ 
        sortBy : undefined, 
        sortOrder : 'asc', 
        page : 1, 
        count : 5, 
        thead : true, 
        pagination : true 
      });
      expect(element.scope().theadDirective).toEqual(true);
      expect(element.scope().paginationDirective).toEqual(true);
    });

    it('should return the right url after called buildUrl', function () {
      urlToCall = 'api.json?sort-order=asc&page=1&count=5&city=sf';
      $httpBackend.whenGET(urlToCall).respond(completeJSON);
      $timeout.flush();
      $httpBackend.flush();
      $scope.$digest();
      expect(element.scope().rows[0].name).toEqual('Ritual Coffee Roasters');
      expect(element.scope().rows.length).toEqual(5);
    });
  });
  



  describe('ngTasty table withs sorting', function () {
    beforeEach(inject(function ($rootScope, $compile, $http, _$httpBackend_, _$timeout_, _sortingJSON_) {
      $scope = $rootScope.$new();
      $timeout = _$timeout_;
      $httpBackend = _$httpBackend_;
      sortingJSON = _sortingJSON_;
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
      $compile(element)($scope);
      $scope.$digest();
    }));

    it('should have these element.scope() value as default', function () {
      //console.log($scope)
      expect(element.scope().query).toEqual({
        'page': 'page',
        'count': 'count',
        'sortBy': 'sort-by',
        'sortOrder': 'sort-order',
      });
      expect(element.scope().url).toEqual('');
      expect(element.scope().header).toEqual({
        'columns': []
      });
      expect(element.scope().rows).toEqual([]);
      expect(element.scope().pagination).toEqual({});
      expect(element.scope().params).toEqual({ 
        sortBy : undefined, 
        sortOrder : 'asc', 
        page : 1, 
        count : 5, 
        thead : true 
      });
      expect(element.scope().theadDirective).toEqual(true);
      expect(element.scope().paginationDirective).toEqual(false);   
    });

    it('should return the right url after called buildUrl', function () {
      urlToCall = 'api.json?sort-order=asc';
      $httpBackend.whenGET(urlToCall).respond(sortingJSON);
      $timeout.flush();
      $httpBackend.flush();
      $scope.$digest();
      expect(element.scope().rows[0].name).toEqual('Ritual Coffee Roasters');
      expect(element.scope().rows.length).toEqual(35);
    });
  });
  



  describe('ngTasty table with pagination', function () {
    beforeEach(inject(function ($rootScope, $compile, $http, _$httpBackend_, _$timeout_, _paginationJSON_) {
      $scope = $rootScope.$new();
      $timeout = _$timeout_;
      $httpBackend = _$httpBackend_;
      paginationJSON = _paginationJSON_;
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
      $compile(element)($scope);
      $scope.$digest();
    }));

    it('should have these element.scope() value as default', function () {
      //console.log($scope)
      expect(element.scope().query).toEqual({
        'page': 'page',
        'count': 'count',
        'sortBy': 'sort-by',
        'sortOrder': 'sort-order',
      });
      expect(element.scope().url).toEqual('');
      expect(element.scope().header).toEqual({
        'columns': []
      });
      expect(element.scope().rows).toEqual([]);
      expect(element.scope().pagination).toEqual({});
      expect(element.scope().params).toEqual({ 
        sortBy : undefined, 
        sortOrder : 'asc', 
        page : 1, 
        count : 5, 
        pagination : true 
      });
      expect(element.scope().theadDirective).toEqual(false);
      expect(element.scope().paginationDirective).toEqual(true);
    });

    it('should return the right url after called buildUrl', function () {
      urlToCall = 'api.json?page=1&count=5';
      $httpBackend.whenGET(urlToCall).respond(paginationJSON);
      $timeout.flush();
      $httpBackend.flush();
      $scope.$digest();
      expect(element.scope().rows[0].name).toEqual('Ritual Coffee Roasters');
      expect(element.scope().rows.length).toEqual(5);
    });
  });




  describe('ngTasty table with filtes', function () {
    beforeEach(inject(function ($rootScope, $compile, $http, _$httpBackend_, _$timeout_, _filtersJSON_) {
      $scope = $rootScope.$new();
      $timeout = _$timeout_;
      $httpBackend = _$httpBackend_;
      filtersJSON = _filtersJSON_;
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
      $compile(element)($scope);
      $scope.$digest();
    }));

    it('should have these element.scope() value as default', function () {
      //console.log($scope)
      expect(element.scope().query).toEqual({
        'page': 'page',
        'count': 'count',
        'sortBy': 'sort-by',
        'sortOrder': 'sort-order',
      });
      expect(element.scope().url).toEqual('');
      expect(element.scope().header).toEqual({
        'columns': []
      });
      expect(element.scope().rows).toEqual([]);
      expect(element.scope().pagination).toEqual({});
      expect(element.scope().params).toEqual({ 
        sortBy : undefined, 
        sortOrder : 'asc', 
        page : 1, 
        count : 5 
      });
      expect(element.scope().theadDirective).toEqual(false);
      expect(element.scope().paginationDirective).toEqual(false);
    });

    it('should return the right url after called buildUrl', function () {
      urlToCall = 'api.json?city=sf';
      $httpBackend.whenGET(urlToCall).respond(filtersJSON);
      $timeout.flush();
      $httpBackend.flush();
      $scope.$digest();
      expect(element.scope().rows[0].name).toEqual('Ritual Coffee Roasters');
      expect(element.scope().rows.length).toEqual(35);
    });
  });
});
