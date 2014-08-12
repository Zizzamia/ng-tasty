describe('Directive', function () {
  'use strict';
  var $scope, $timeout, $httpBackend, $compile;
  var element, params, urlToCall, filters, createDirective, field,
  elementSelected, expected, completeJSON, sortingJSON, paginationJSON,
  filtersJSON, tastyTable, tastyPagination, tastyThead, paginationJSONCount25;

  beforeEach(module('ngMock'));
  beforeEach(module('ngTasty.filter'));
  beforeEach(module('ngTasty.service'));
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
      expected = 'AngularJS tastyTable directive: the resource (getResource) callback it\'s undefined';
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
      tastyTable = $compile(element)($scope);
      tastyThead = tastyTable.find('[tasty-thead=""]');
      urlToCall = 'api.json?sort-order=asc';
      $httpBackend.whenGET(urlToCall).respond(sortingJSON);
      $timeout.flush();
      $httpBackend.flush();
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
      expect(element.scope().url).toEqual('sort-order=asc');
      expect(element.scope().header.columns.length).toEqual(3);
      expect(element.scope().rows.length).toEqual(35);
      expect(element.scope().pagination).toEqual({ 
        'count' : null, 
        'page' : null, 
        'pages' : null, 
        'size' : 35
      });
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
      expect(element.scope().rows[0].name).toEqual('Ritual Coffee Roasters');
      expect(element.scope().rows.length).toEqual(35);
    });

    it('should have these isolateScope value as default', function () {
      expect(tastyThead.isolateScope().fields).toEqual({ 
        'name' : { 'width' : 33.33, 'sort' : 'name' }, 
        'star' : { 'width' : 33.33, 'sort' : 'star' }, 
        'sf-location' : { 'width' : 33.33, 'sort' : 'sf-location' } 
      });
    });

    it('should set params.sortBy when scope.sortBy is clicked', function () {
      field = {'key': 'sf-location', 'name': 'SF Location'};
      tastyThead.isolateScope().sortBy(field);
      expect(element.scope().params.sortBy).toEqual('sf-location');
      field =  {'key': 'star', 'name': 'star'};
      tastyThead.isolateScope().sortBy(field);
      expect(element.scope().params.sortBy).toEqual('star');
    });

    it('should sorting ascending and descending scope.header.sortBy when scope.sortBy is clicked', function () {
      field = {'key': 'sf-location', 'name': 'SF Location'};
      tastyThead.isolateScope().sortBy(field);
      expect(tastyThead.isolateScope().header.sortBy).toEqual('sf-location');
      tastyThead.isolateScope().sortBy(field);
      expect(tastyThead.isolateScope().header.sortBy).toEqual('-sf-location');
    });

    it('should return true or false to indicate if a specific key is sorted up', function () {
      var isSortUp;
      field = {'key': 'sf-location', 'name': 'SF Location'};
      tastyThead.isolateScope().sortBy(field);
      isSortUp = tastyThead.isolateScope().isSortUp(field);
      expect(isSortUp).toEqual(false);
      tastyThead.isolateScope().sortBy(field);
      isSortUp = tastyThead.isolateScope().isSortUp(field);
      expect(isSortUp).toEqual(true);
    });

    it('should return true or false to indicate if a specific key is sorted down', function () {
      var isSortDown;
      field = {'key': 'sf-location', 'name': 'SF Location'};
      tastyThead.isolateScope().sortBy(field);
      isSortDown = tastyThead.isolateScope().isSortDown(field);
      expect(isSortDown).toEqual(true);
      tastyThead.isolateScope().sortBy(field);
      isSortDown = tastyThead.isolateScope().isSortDown(field);
      expect(isSortDown).toEqual(false);
    });
  });
  



  describe('ngTasty table with pagination', function () {
    beforeEach(inject(function ($rootScope, $compile, $http, _$httpBackend_, 
      _$timeout_, _paginationJSON_, _paginationJSONCount25_) {
      $scope = $rootScope.$new();
      $timeout = _$timeout_;
      $httpBackend = _$httpBackend_;
      paginationJSON = _paginationJSON_;
      paginationJSONCount25 = _paginationJSONCount25_;
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
      '  <tasty-pagination></tasty-pagination>'+
      '</div>');
      tastyTable = $compile(element)($scope);
      tastyPagination = tastyTable.find('tasty-pagination');
      urlToCall = 'api.json?page=1&count=5';
      $httpBackend.whenGET(urlToCall).respond(paginationJSON);
      $timeout.flush();
      $httpBackend.flush();
      $scope.$digest();
    }));

    it('should have these element.scope() value after 100ms', function () {
      //console.log($scope)
      expect(element.scope().query).toEqual({
        'page': 'page',
        'count': 'count',
        'sortBy': 'sort-by',
        'sortOrder': 'sort-order',
      });
      expect(element.scope().url).toEqual('page=1&count=5');
      expect(element.scope().header.columns.length).toEqual(3);
      expect(element.scope().rows.length).toEqual(5);
      expect(element.scope().pagination).toEqual({ 
        'count' : 5, 
        'page' : 1,
        'pages' : 7, 
        'size' : 35 
      });
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
      expect(element.scope().rows[0].name).toEqual('Ritual Coffee Roasters');
      expect(element.scope().rows.length).toEqual(5);
    });

    it('should have these isolateScope value as default', function () {
      expect(tastyPagination.isolateScope().pagination).toEqual({ 
        'count' : 5, 
        'page' : 1,
        'pages' : 7, 
        'size' : 35 
      });
      expect(tastyPagination.isolateScope().pagListCount).toEqual([5, 25]);
      expect(tastyPagination.isolateScope().pagMinRange).toEqual(1);
      expect(tastyPagination.isolateScope().pagMaxRange).toEqual(6);
    });

    it('should generate page count button using ng-repeat', function () {
      elementSelected = element.find('[ng-repeat="count in pagListCount"]');
      expect(elementSelected.length).toEqual(2);
    });
    
    it('should use correct class for the selected page count', function () {
      elementSelected = element.find('[ng-repeat="count in pagListCount"]');
      expect(elementSelected.eq(0)).toHaveClass('active');
      expect(elementSelected.eq(1)).not.toHaveClass('active');
      tastyPagination.isolateScope().page.setCount(25);
      $scope.$digest();
      urlToCall = 'api.json?page=1&count=25';
      $httpBackend.whenGET(urlToCall).respond(paginationJSONCount25);
      $timeout.flush();
      $httpBackend.flush();
      expect(tastyPagination.isolateScope().pagination).toEqual({ 
        'count' : 25, 
        'page' : 1,
        'pages' : 2, 
        'size' : 35 
      });
      expect(elementSelected.eq(0)).not.toHaveClass('active');
      expect(elementSelected.eq(1)).toHaveClass('active');
    });
    
    it('should update params.page when page.get is clicked', function () {
      tastyPagination.isolateScope().page.get(1);
      expect(element.scope().params.page).toEqual(1);
    });
    
    it('should update params.count when page.setCount is clicked', function () {
      tastyPagination.isolateScope().page.setCount(25);
      expect(element.scope().params.count).toEqual(25);
      expect(element.scope().params.page).toEqual(1);
    });

    it('should update pagMinRange and pagMaxRange when page.previous and page.remaining are clicked', function () {
      expect(tastyPagination.isolateScope().pagMinRange).toEqual(1);
      expect(tastyPagination.isolateScope().pagMaxRange).toEqual(6);
      tastyPagination.isolateScope().page.previous();
      expect(tastyPagination.isolateScope().pagMinRange).toEqual(1);
      expect(tastyPagination.isolateScope().pagMaxRange).toEqual(6);
      tastyPagination.isolateScope().page.remaining();
      expect(tastyPagination.isolateScope().pagMinRange).toEqual(2);
      expect(tastyPagination.isolateScope().pagMaxRange).toEqual(7);
      tastyPagination.isolateScope().page.previous();
      expect(tastyPagination.isolateScope().pagMinRange).toEqual(1);
      expect(tastyPagination.isolateScope().pagMaxRange).toEqual(6);
    });

    it('should update rangePage when page.previous and page.remaining are clicked', function () {
      expect(tastyPagination.isolateScope().rangePage).toEqual([1,2,3,4,5]);
      tastyPagination.isolateScope().page.previous();
      expect(tastyPagination.isolateScope().rangePage).toEqual([1,2,3,4,5]);
      tastyPagination.isolateScope().page.remaining();
      expect(tastyPagination.isolateScope().rangePage).toEqual([2,3,4,5,6]);
      tastyPagination.isolateScope().page.previous();
      expect(tastyPagination.isolateScope().rangePage).toEqual([1,2,3,4,5]);
    });
  });




  describe('ngTasty table with filters', function () {
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