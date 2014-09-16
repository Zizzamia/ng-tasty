describe('Directive', function () {
  'use strict';
  var $rootScope, $scope, $timeout, $httpBackend, $compile;
  var element, params, urlToCall, filters, createDirective, field, elm,
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
      expected = 'AngularJS tastyTable directive: need the resource or resource-callback attribute';
      expect(errorFunctionWrapper).toThrow(expected);
    });

    it('should return a throw message if the resource set it\'s undefined', function () {
      function errorFunctionWrapper() {
        element = angular.element('<div tasty-table resource="getResource"></div>');
        $compile(element)($scope);
        $scope.$digest();
      }
      expected = 'AngularJS tastyTable directive: the resource (getResource) it\'s not an object';
      expect(errorFunctionWrapper).toThrow(expected);
    });

    it('should return a throw message if the resource-callback set it\'s undefined', function () {
      function errorFunctionWrapper() {
        element = angular.element('<div tasty-table resource-callback="getResource"></div>');
        $compile(element)($scope);
        $scope.$digest();
      }
      expected = 'AngularJS tastyTable directive: the resource-callback (getResource) it\'s not a function';
      expect(errorFunctionWrapper).toThrow(expected);
    });
  });



  
  describe('ngTasty table bad resource-callback implementation', function () {
    beforeEach(inject(function ($rootScope, $compile, $http, _$httpBackend_, _$timeout_) {
      $scope = $rootScope.$new();
      $timeout = _$timeout_;
      $httpBackend = _$httpBackend_;
      $scope.getResource = function (paramsUrl, paramsObj) {
        return $http.get('api.json?' + paramsUrl).then(function (response) {
          return undefined;
        });
      };
      $scope.filters = {
        'city': 'sf'
      };
      element = angular.element(''+
      '<div tasty-table resource-callback="getResource" filters="filters">'+
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

    it('should return a throw message if the response is not a object', function () {
      function errorFunctionWrapper() {
        urlToCall = 'api.json?sort-order=asc&page=1&count=5&city=sf';
        $httpBackend.whenGET(urlToCall).respond({});
        $timeout.flush();
        $httpBackend.flush();
        $scope.$digest();
      }
      expected = 'AngularJS tastyTable directive: the resource it\'s not an object';
      expect(errorFunctionWrapper).toThrow(expected);
    });
  });




  describe('ngTasty table complete server side', function () {
    beforeEach(inject(function ($rootScope, $compile, $http, _$httpBackend_, _$timeout_, _completeJSON_) {
      $scope = $rootScope.$new();
      $timeout = _$timeout_;
      $httpBackend = _$httpBackend_;
      completeJSON = _completeJSON_;
      $scope.getResource = function (paramsUrl, paramsObj) {
        return $http.get('api.json?' + paramsUrl).then(function (response) {
          $scope.paramsUrl = paramsUrl;
          $scope.paramsObj = paramsObj;
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
      '<div tasty-table resource-callback="getResource" filters="filters">'+
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
      expect(element.isolateScope().query).toEqual({
        'page': 'page',
        'count': 'count',
        'sortBy': 'sort-by',
        'sortOrder': 'sort-order',
      });
      expect(element.isolateScope().url).toEqual('');
      expect(element.isolateScope().header).toEqual({
        'columns': []
      });
      expect(element.isolateScope().rows).toEqual([]);
      expect(element.isolateScope().pagination.count).toEqual(5);
      expect(element.isolateScope().pagination.page).toEqual(1);
      expect(element.isolateScope().pagination.pages).toEqual(1);
      expect(element.isolateScope().pagination.size).toEqual(0);
      expect(element.isolateScope().params.sortBy).toEqual(undefined);
      expect(element.isolateScope().params.sortOrder).toEqual('asc');
      expect(element.isolateScope().params.page).toEqual(1);
      expect(element.isolateScope().params.count).toEqual(5);
      expect(element.isolateScope().params.thead).toEqual(true);
      expect(element.isolateScope().params.pagination).toEqual(true);
      expect(element.isolateScope().theadDirective).toEqual(true);
      expect(element.isolateScope().paginationDirective).toEqual(true);
    });

    it('should return the right url after called buildUrl', function () {
      urlToCall = 'api.json?sort-order=asc&page=1&count=5&city=sf';
      $httpBackend.whenGET(urlToCall).respond(completeJSON);
      $timeout.flush();
      $httpBackend.flush();
      $scope.$digest();
      expect(element.scope().rows[0].name).toEqual('Ritual Coffee Roasters');
      expect(element.scope().rows.length).toEqual(5);
      expect($scope.paramsUrl).toEqual('sort-order=asc&page=1&count=5&city=sf');
      expect($scope.paramsObj).toEqual({ 
        sortBy : undefined, 
        sortOrder : 'asc', 
        page : 1, 
        count : 5, 
        thead : true, 
        pagination : true 
      });
    });

    it('should return a throw message if the response has the property header or rows defined', function () {
      function errorFunctionWrapper() {
        urlToCall = 'api.json?sort-order=asc&page=1&count=5&city=sf';
        $httpBackend.whenGET(urlToCall).respond({});
        $timeout.flush();
        $httpBackend.flush();
        $scope.$digest();
      }
      expected = 'AngularJS tastyTable directive: the resource has the property header or rows undefined';
      expect(errorFunctionWrapper).toThrow(expected);
    });
  });
  


  describe('ngTasty table withs sorting', function () {
    beforeEach(inject(function ($rootScope, $compile, _$timeout_, _sortingJSON_) {
      $scope = $rootScope.$new();
      $timeout = _$timeout_;
      $scope.resource = _sortingJSON_;
      element = angular.element(''+
      '<table tasty-table resource="resource">'+
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
      $timeout.flush();
      $scope.$digest();
    }));

    it('should have these element.scope() value as default', function () {
      expect(element.isolateScope().query).toEqual({
        'page': 'page',
        'count': 'count',
        'sortBy': 'sort-by',
        'sortOrder': 'sort-order',
      });
      expect(element.isolateScope().url).toEqual('');
      expect(element.isolateScope().header.columns.length).toEqual(3);
      expect(element.isolateScope().rows.length).toEqual(35);
      expect(element.isolateScope().pagination).toEqual({ 
        'count' : null, 
        'page' : null, 
        'pages' : null, 
        'size' : 35
      });
      expect(element.isolateScope().params.sortBy).toEqual(undefined);
      expect(element.isolateScope().params.sortOrder).toEqual('asc');
      expect(element.isolateScope().params.page).toEqual(1);
      expect(element.isolateScope().params.count).toEqual(undefined);
      expect(element.isolateScope().params.thead).toEqual(true);
      expect(element.isolateScope().theadDirective).toEqual(true);
      expect(element.isolateScope().paginationDirective).toEqual(false);   
    });

    it('should return the right url after called buildUrl', function () {
      expect(element.isolateScope().rows[0].name).toEqual('Andytown Coffee Roasters');
      expect(element.isolateScope().rows.length).toEqual(35);
    });

    it('should have these isolateScope value as default', function () {
      expect(tastyThead.isolateScope().columns[0].active).toEqual(true);
      expect(tastyThead.isolateScope().columns[0].sortable).toEqual(true);
      expect(tastyThead.isolateScope().columns[0].width).toEqual({ 'width' : '33.33%' });
      expect(tastyThead.isolateScope().columns[1].active).toEqual(false);
      expect(tastyThead.isolateScope().columns[1].sortable).toEqual(true);
      expect(tastyThead.isolateScope().columns[1].width).toEqual({ 'width' : '33.33%' });
      expect(tastyThead.isolateScope().columns[2].active).toEqual(false);
      expect(tastyThead.isolateScope().columns[2].sortable).toEqual(true);
      expect(tastyThead.isolateScope().columns[2].width).toEqual({ 'width' : '33.33%' });
    });

    it('should set params.sortBy when scope.sortBy is clicked', function () {
      field = {'key': 'name', 'name': 'Name'};
      tastyThead.isolateScope().sortBy(field);
      tastyThead.isolateScope().setColumns();
      expect(element.isolateScope().params.sortBy).toEqual('name');
      expect(tastyThead.isolateScope().columns[0].active).toEqual(true);
      field =  {'key': 'star', 'name': 'Star'};
      tastyThead.isolateScope().sortBy(field);
      tastyThead.isolateScope().setColumns();
      expect(element.isolateScope().params.sortBy).toEqual('star');
      expect(tastyThead.isolateScope().columns[1].active).toEqual(true);
    });

    it('should sorting ascending and descending scope.header.sortBy when scope.sortBy is clicked', function () {
      field =  {'key': 'star', 'name': 'star'};
      tastyThead.isolateScope().sortBy(field);
      $scope.$digest();
      $timeout.flush();
      expect(tastyThead.isolateScope().header.sortBy).toEqual('star');
      expect(element.isolateScope().rows[0].name).toEqual('Peet\'s');
      tastyThead.isolateScope().sortBy(field);
      $scope.$digest();
      $timeout.flush();
      expect(tastyThead.isolateScope().header.sortBy).toEqual('-star');
      expect(element.isolateScope().rows[0].name).toEqual('Ritual Coffee Roasters');
    });

    it('should sorting ascending and descending with a key contains a dash (-)', function () {
      field =  { 'key': 'sf-location', 'name': 'SF Location'};
      tastyThead.isolateScope().sortBy(field);
      $scope.$digest();
      $timeout.flush();
      expect(tastyThead.isolateScope().header.sortBy).toEqual('sf-location');
      expect(element.isolateScope().rows[0].name).toEqual('CoffeeShop');
      tastyThead.isolateScope().sortBy(field);
      $scope.$digest();
      $timeout.flush();
      expect(tastyThead.isolateScope().header.sortBy).toEqual('-sf-location');
      expect(element.isolateScope().rows[0].name).toEqual('Flywheel Coffee Roasters');
    });

    it('should return true or false to indicate if a specific key is sorted up', function () {
      field = field =  {'key': 'star', 'name': 'star'};
      tastyThead.isolateScope().sortBy(field);
      $scope.$digest();
      expect(tastyThead.isolateScope().columns[1].isSortUp).toEqual(false);
      tastyThead.isolateScope().sortBy(field);
      $scope.$digest();
      expect(tastyThead.isolateScope().columns[1].isSortUp).toEqual(true);
    });

    it('should return true or false to indicate if a specific key is sorted down', function () {
      field = field =  {'key': 'star', 'name': 'star'};
      tastyThead.isolateScope().sortBy(field);
      $scope.$digest();
      expect(tastyThead.isolateScope().columns[1].isSortDown).toEqual(true);
      tastyThead.isolateScope().sortBy(field);
      $scope.$digest();
      expect(tastyThead.isolateScope().columns[1].isSortDown).toEqual(false);
    });
  });




  describe('ngTasty table withs sorting server side', function () {
    beforeEach(inject(function (_$rootScope_, $compile, $http, _$httpBackend_, _$timeout_, _sortingJSON_) {
      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();
      $timeout = _$timeout_;
      $httpBackend = _$httpBackend_;
      sortingJSON = _sortingJSON_;
      $scope.getResource = function (paramsUrl, paramsObj) {
        return $http.get('api.json?' + paramsUrl).then(function (response) {
          $scope.paramsUrl = paramsUrl;
          $scope.paramsObj = paramsObj;
          return {
            'rows': response.data.rows,
            'header': response.data.header,
            'pagination': response.data.pagination,
            'sortBy': response.data['sort-by'],
            'sortOrder': response.data['sort-order']
          };
        });
      };
      $scope.notSortBy = ['sf-location'];
      element = angular.element(''+
      '<table tasty-table resource-callback="getResource">'+
      '  <thead tasty-thead not-sort-by="notSortBy"></thead>'+
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
      expect(element.isolateScope().query).toEqual({
        'page': 'page',
        'count': 'count',
        'sortBy': 'sort-by',
        'sortOrder': 'sort-order',
      });
      expect(element.isolateScope().url).toEqual('sort-order=asc');
      expect(element.isolateScope().header.columns.length).toEqual(3);
      expect(element.isolateScope().rows.length).toEqual(35);
      expect(element.isolateScope().pagination).toEqual({ 
        'count' : null, 
        'page' : null, 
        'pages' : null, 
        'size' : 35
      });
      expect(element.isolateScope().params.sortBy).toEqual(undefined);
      expect(element.isolateScope().params.sortOrder).toEqual('asc');
      expect(element.isolateScope().params.page).toEqual(1);
      expect(element.isolateScope().params.count).toEqual(undefined);
      expect(element.isolateScope().params.thead).toEqual(true);
      expect(element.isolateScope().theadDirective).toEqual(true);
      expect(element.isolateScope().paginationDirective).toEqual(false);  
      expect($scope.paramsUrl).toEqual('sort-order=asc');
      expect($scope.paramsObj.sortBy).toEqual(undefined);
      expect($scope.paramsObj.sortOrder).toEqual('asc');
      expect($scope.paramsObj.page).toEqual(1);
      expect($scope.paramsObj.count).toEqual(undefined);
      expect($scope.paramsObj.thead).toEqual(true);
      expect($scope.paramsObj.pagination).toEqual(undefined);
    });

    it('should return the right url after called buildUrl', function () {
      expect(element.isolateScope().rows[0].name).toEqual('Ritual Coffee Roasters');
      expect(element.isolateScope().rows.length).toEqual(35);
    });

    it('should have these isolateScope value as default', function () {
      expect(tastyThead.isolateScope().columns[0].active).toEqual(true);
      expect(tastyThead.isolateScope().columns[0].sortable).toEqual(true);
      expect(tastyThead.isolateScope().columns[0].width).toEqual({ 'width' : '33.33%' });
      expect(tastyThead.isolateScope().columns[1].key).toEqual('star');
      expect(tastyThead.isolateScope().columns[1].name).toEqual('Star');
      expect(tastyThead.isolateScope().columns[1].active).toEqual(false);
      expect(tastyThead.isolateScope().columns[1].sortable).toEqual(true);
      expect(tastyThead.isolateScope().columns[1].width).toEqual({ 'width' : '33.33%' });
      expect(tastyThead.isolateScope().columns[1].isSortUp).toEqual(false);
      expect(tastyThead.isolateScope().columns[1].isSortDown).toEqual(false);
      expect(tastyThead.isolateScope().columns[2].key).toEqual('sf-location');
      expect(tastyThead.isolateScope().columns[2].name).toEqual('SF Location');
      expect(tastyThead.isolateScope().columns[2].active).toEqual(false);
      expect(tastyThead.isolateScope().columns[2].sortable).toEqual(false);
      expect(tastyThead.isolateScope().columns[2].width).toEqual({ 'width' : '33.33%' });
      expect(tastyThead.isolateScope().columns[2].isSortUp).toEqual(false);
      expect(tastyThead.isolateScope().columns[2].isSortDown).toEqual(false);
    });

    it('should set params.sortBy when scope.sortBy is clicked', function () {
      field = {'key': 'name', 'name': 'Name'};
      tastyThead.isolateScope().sortBy(field);
      tastyThead.isolateScope().setColumns();
      expect(element.isolateScope().params.sortBy).toEqual('name');
      expect(tastyThead.isolateScope().columns[0].active).toEqual(true);
      field = {'key': 'star', 'name': 'Star'};
      tastyThead.isolateScope().sortBy(field);
      tastyThead.isolateScope().setColumns();
      expect(element.isolateScope().params.sortBy).toEqual('star');
      expect(tastyThead.isolateScope().columns[1].active).toEqual(true);
    });

    it('should not set params.sortBy when scope.sortBy is one of the notSortBy keys', function () {
      field = {'key': 'star', 'name': 'Star'};
      tastyThead.isolateScope().sortBy(field);
      expect(element.isolateScope().params.sortBy).toEqual('star');
      field = {'key': 'sf-location', 'name': 'SF Location'};
      tastyThead.isolateScope().sortBy(field);
      expect(element.isolateScope().params.sortBy).toEqual('star');
    });

    it('should sorting ascending and descending scope.header.sortBy when scope.sortBy is clicked', function () {
      field = {'key': 'star', 'name': 'Star'};
      tastyThead.isolateScope().sortBy(field);
      expect(tastyThead.isolateScope().header.sortBy).toEqual('star');
      tastyThead.isolateScope().sortBy(field);
      expect(tastyThead.isolateScope().header.sortBy).toEqual('-star');
    });

    it('should return true or false to indicate if a specific key is sorted up', function () {
      field = {'key': 'star', 'name': 'Star'};
      tastyThead.isolateScope().sortBy(field);
      $scope.$digest();
      expect(tastyThead.isolateScope().columns[1].isSortUp).toEqual(false);
      tastyThead.isolateScope().sortBy(field);
      $scope.$digest();
      expect(tastyThead.isolateScope().columns[1].isSortUp).toEqual(true);
    });

    it('should return true or false to indicate if a specific key is sorted down', function () {
      field = {'key': 'star', 'name': 'Star'};
      tastyThead.isolateScope().sortBy(field);
      $scope.$digest();
      expect(tastyThead.isolateScope().columns[1].isSortDown).toEqual(true);
      tastyThead.isolateScope().sortBy(field);
      $scope.$digest();
      expect(tastyThead.isolateScope().columns[1].isSortDown).toEqual(false);
    });

    it('should set the last sortBy and sortOrder params when doesn\'t back from backend', function () {
      sortingJSON['sortOrder'] = undefined;
      field = {'key': 'star', 'name': 'Star'};
      tastyThead.isolateScope().sortBy(field);
      $scope.$digest();
      urlToCall = 'api.json?sort-by=star&sort-order=asc';
      $httpBackend.whenGET(urlToCall).respond(sortingJSON);
      $timeout.flush();
      $httpBackend.flush();
      expect(tastyThead.isolateScope().header.sortBy).toEqual('star');
      expect(tastyThead.isolateScope().header.sortOrder).toEqual('asc');
      field = {'key': 'name', 'name': 'Name'};
      tastyThead.isolateScope().sortBy(field);
      $scope.$digest();
      urlToCall = 'api.json?sort-by=name&sort-order=asc';
      $httpBackend.whenGET(urlToCall).respond(sortingJSON);
      $timeout.flush();
      $httpBackend.flush();
      expect(tastyThead.isolateScope().header.sortBy).toEqual('name');
      expect(tastyThead.isolateScope().header.sortOrder).toEqual('asc');
    });
  });
  


  
  describe('ngTasty table with basic pagination', function () {
    beforeEach(inject(function ($rootScope, $compile, _$timeout_) {
      $scope = $rootScope.$new();
      $timeout = _$timeout_;
      $scope.resource = {
        'header': [{ 'key': 'name', 'name': 'Name' },
          { 'key': 'star', 'name': 'Star' },
          { 'key': 'sf-location', 'name': 'SF Location'}
        ],
        'rows': [{
          'name': 'Ritual Coffee Roasters',
          'star': '★★★★★',
          'sf-location': 'Hayes Valley'
        }]
      };
      element = angular.element(''+
      '<div tasty-table resource="resource">'+
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
      $timeout.flush();
      $scope.$digest();
    }));

    it('should have these element.scope() value after 100ms', function () {
      expect(element.isolateScope().query).toEqual({
        'page': 'page',
        'count': 'count',
        'sortBy': 'sort-by',
        'sortOrder': 'sort-order',
      });
      expect(element.isolateScope().url).toEqual('');
      expect(element.isolateScope().header.columns.length).toEqual(3);
      expect(element.isolateScope().rows.length).toEqual(1);
      expect(element.isolateScope().pagination.count).toEqual(5);
      expect(element.isolateScope().pagination.page).toEqual(1);
      expect(element.isolateScope().pagination.pages).toEqual(1);
      expect(element.isolateScope().pagination.size).toEqual(1);
      expect(element.isolateScope().params.sortBy).toEqual(undefined);
      expect(element.isolateScope().params.sortOrder).toEqual('asc');
      expect(element.isolateScope().params.page).toEqual(1);
      expect(element.isolateScope().params.count).toEqual(5);
      expect(element.isolateScope().params.pagination).toEqual(true);
      expect(element.isolateScope().theadDirective).toEqual(false);
      expect(element.isolateScope().paginationDirective).toEqual(true);
    });

    it('should return the right url after called buildUrl', function () {
      expect(element.isolateScope().rows[0].name).toEqual('Ritual Coffee Roasters');
      expect(element.isolateScope().rows.length).toEqual(1);
    });

    it('should have these isolateScope value as default', function () {
      expect(tastyPagination.isolateScope().pagination.count).toEqual(5);
      expect(tastyPagination.isolateScope().pagination.page).toEqual(1);
      expect(tastyPagination.isolateScope().pagination.pages).toEqual(1);
      expect(tastyPagination.isolateScope().pagination.size).toEqual(1);
      expect(tastyPagination.isolateScope().listItemsPerPageShow).toEqual([5, 25]);
      expect(tastyPagination.isolateScope().pagMinRange).toEqual(1);
      expect(tastyPagination.isolateScope().pagMaxRange).toEqual(2);
    });

    it('should generate page count button using ng-repeat', function () {
      elementSelected = element.find('[ng-repeat="count in listItemsPerPageShow"]');
      expect(elementSelected.length).toEqual(2);
    });
  });


  describe('ngTasty table with pagination', function () {
    beforeEach(inject(function ($rootScope, $compile, _$timeout_, _sortingJSON_) {
      $scope = $rootScope.$new();
      $timeout = _$timeout_;
      $scope.resource = _sortingJSON_;
      $scope.itemsPerPage = 10;
      $scope.listItemsPerPage = [5, 10, 20, 40, 80];
      element = angular.element(''+
      '<div tasty-table resource="resource">'+
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
      '  <tasty-pagination items-per-page="itemsPerPage" '+
      '  list-items-per-page="listItemsPerPage"></tasty-pagination>'+
      '</div>');
      tastyTable = $compile(element)($scope);
      tastyPagination = tastyTable.find('tasty-pagination');
      $timeout.flush();
      $scope.$digest();
    }));

    it('should have these element.scope() value after 100ms', function () {
      expect(element.isolateScope().query).toEqual({
        'page': 'page',
        'count': 'count',
        'sortBy': 'sort-by',
        'sortOrder': 'sort-order',
      });
      expect(element.isolateScope().url).toEqual('');
      expect(element.isolateScope().header.columns.length).toEqual(3);
      expect(element.isolateScope().rows.length).toEqual(10);
      expect(element.isolateScope().pagination.count).toEqual(10);
      expect(element.isolateScope().pagination.page).toEqual(1);
      expect(element.isolateScope().pagination.pages).toEqual(4);
      expect(element.isolateScope().pagination.size).toEqual(35);
      expect(element.isolateScope().params.sortBy).toEqual(undefined);
      expect(element.isolateScope().params.sortOrder).toEqual('asc');
      expect(element.isolateScope().params.page).toEqual(1);
      expect(element.isolateScope().params.count).toEqual(10);
      expect(element.isolateScope().params.pagination).toEqual(true);
      expect(element.isolateScope().theadDirective).toEqual(false);
      expect(element.isolateScope().paginationDirective).toEqual(true);
    });

    it('should return the right url after called buildUrl', function () {
      expect(element.isolateScope().rows[0].name).toEqual('Ritual Coffee Roasters');
      expect(element.isolateScope().rows.length).toEqual(10);
    });

    it('should have these isolateScope value as default', function () {
      expect(tastyPagination.isolateScope().pagination.count).toEqual(10);
      expect(tastyPagination.isolateScope().pagination.page).toEqual(1);
      expect(tastyPagination.isolateScope().pagination.pages).toEqual(4);
      expect(tastyPagination.isolateScope().pagination.size).toEqual(35);
      expect(tastyPagination.isolateScope().listItemsPerPageShow).toEqual([5, 10, 20]);
      expect(tastyPagination.isolateScope().pagMinRange).toEqual(1);
      expect(tastyPagination.isolateScope().pagMaxRange).toEqual(5);
    });

    it('should generate page count button using ng-repeat', function () {
      elementSelected = element.find('[ng-repeat="count in listItemsPerPageShow"]');
      expect(elementSelected.length).toEqual(3);
    });
    
    it('should use correct class for the selected page count', function () {
      elementSelected = element.find('[ng-repeat="count in listItemsPerPageShow"]');
      expect(elementSelected.eq(0)).not.toHaveClass('active');
      expect(elementSelected.eq(1)).toHaveClass('active');
      expect(elementSelected.eq(2)).not.toHaveClass('active');
      tastyPagination.isolateScope().page.setCount(20);
      $scope.$digest();
      $timeout.flush();
      expect(tastyPagination.isolateScope().pagination).toEqual({ 
        'count' : 20, 
        'page' : 1,
        'pages' : 2, 
        'size' : 35 
      });
      expect(elementSelected.eq(0)).not.toHaveClass('active');
      expect(elementSelected.eq(1)).not.toHaveClass('active');
      expect(elementSelected.eq(2)).toHaveClass('active');
    });
    
    it('should update params.page when page.get is clicked', function () {
      tastyPagination.isolateScope().page.get(1);
      expect(element.isolateScope().params.page).toEqual(1);
    });
    
    it('should update params.count when page.setCount is clicked', function () {
      tastyPagination.isolateScope().page.setCount(25);
      expect(element.isolateScope().params.count).toEqual(25);
      expect(element.isolateScope().params.page).toEqual(1);
    });

    it('should update pagMinRange and pagMaxRange when page.previous and page.remaining are clicked', function () {
      expect(tastyPagination.isolateScope().pagMinRange).toEqual(1);
      expect(tastyPagination.isolateScope().pagMaxRange).toEqual(5);
      tastyPagination.isolateScope().page.previous();
      expect(tastyPagination.isolateScope().pagMinRange).toEqual(1);
      expect(tastyPagination.isolateScope().pagMaxRange).toEqual(5);
      tastyPagination.isolateScope().page.remaining();
      expect(tastyPagination.isolateScope().pagMinRange).toEqual(1);
      expect(tastyPagination.isolateScope().pagMaxRange).toEqual(5);
      tastyPagination.isolateScope().page.previous();
      expect(tastyPagination.isolateScope().pagMinRange).toEqual(1);
      expect(tastyPagination.isolateScope().pagMaxRange).toEqual(5);
    });

    it('should update rangePage when page.previous and page.remaining are clicked', function () {
      expect(tastyPagination.isolateScope().rangePage).toEqual([1,2,3,4]);
      tastyPagination.isolateScope().page.previous();
      expect(tastyPagination.isolateScope().rangePage).toEqual([1,2,3,4]);
      tastyPagination.isolateScope().page.remaining();
      expect(tastyPagination.isolateScope().rangePage).toEqual([1,2,3,4]);
      tastyPagination.isolateScope().page.previous();
      expect(tastyPagination.isolateScope().rangePage).toEqual([1,2,3,4]);
    });

    it('has the class col-xs-3 in pagination counting', function () {
      elm = tastyPagination.find('.text-left');
      expect(angular.element(elm).hasClass('col-xs-3')).toBe(true);
    });

    it('has the class col-xs-6 in pagination center', function () {
      elm = tastyPagination.find('.text-center');
      expect(angular.element(elm).hasClass('col-xs-6')).toBe(true);
    });

    it('has the class col-xs-3 in pagination right', function () {
      elm = tastyPagination.find('.text-right');
      expect(angular.element(elm).hasClass('col-xs-3')).toBe(true);
    });
  });

  


  describe('ngTasty table with pagination server side', function () {
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
      '<div tasty-table resource-callback="getResource">'+
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
      expect(element.isolateScope().query).toEqual({
        'page': 'page',
        'count': 'count',
        'sortBy': 'sort-by',
        'sortOrder': 'sort-order',
      });
      expect(element.isolateScope().url).toEqual('page=1&count=5');
      expect(element.isolateScope().header.columns.length).toEqual(3);
      expect(element.isolateScope().rows.length).toEqual(5);
      expect(element.isolateScope().pagination).toEqual({ 
        'count' : 5, 
        'page' : 1,
        'pages' : 7, 
        'size' : 35 
      });
      expect(element.isolateScope().params).toEqual({ 
        sortBy : undefined, 
        sortOrder : 'asc', 
        page : 1, 
        count : 5, 
        pagination : true 
      });
      expect(element.isolateScope().theadDirective).toEqual(false);
      expect(element.isolateScope().paginationDirective).toEqual(true);
    });

    it('should return the right url after called buildUrl', function () {
      expect(element.isolateScope().rows[0].name).toEqual('Ritual Coffee Roasters');
      expect(element.isolateScope().rows.length).toEqual(5);
    });

    it('should have these isolateScope value as default', function () {
      expect(tastyPagination.isolateScope().pagination).toEqual({ 
        'count' : 5, 
        'page' : 1,
        'pages' : 7, 
        'size' : 35 
      });
      expect(tastyPagination.isolateScope().listItemsPerPageShow).toEqual([5, 25]);
      expect(tastyPagination.isolateScope().pagMinRange).toEqual(1);
      expect(tastyPagination.isolateScope().pagMaxRange).toEqual(6);
    });

    it('should generate page count button using ng-repeat', function () {
      elementSelected = element.find('[ng-repeat="count in listItemsPerPageShow"]');
      expect(elementSelected.length).toEqual(2);
    });
    
    it('should use correct class for the selected page count', function () {
      elementSelected = element.find('[ng-repeat="count in listItemsPerPageShow"]');
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
      expect(element.isolateScope().params.page).toEqual(1);
    });
    
    it('should update params.count when page.setCount is clicked', function () {
      tastyPagination.isolateScope().page.setCount(25);
      expect(element.isolateScope().params.count).toEqual(25);
      expect(element.isolateScope().params.page).toEqual(1);
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

    it('has the class col-xs-3 in pagination counting', function () {
      elm = tastyPagination.find('.text-left');
      expect(angular.element(elm).hasClass('col-xs-3')).toBe(true);
    });

    it('has the class col-xs-6 in pagination center', function () {
      elm = tastyPagination.find('.text-center');
      expect(angular.element(elm).hasClass('col-xs-6')).toBe(true);
    });

    it('has the class col-xs-3 in pagination right', function () {
      elm = tastyPagination.find('.text-right');
      expect(angular.element(elm).hasClass('col-xs-3')).toBe(true);
    });
  });




  describe('ngTasty table with filters server side', function () {
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
      '<div tasty-table resource-callback="getResource" filters="filters">'+
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
      expect(element.isolateScope().query).toEqual({
        'page': 'page',
        'count': 'count',
        'sortBy': 'sort-by',
        'sortOrder': 'sort-order',
      });
      expect(element.isolateScope().url).toEqual('');
      expect(element.isolateScope().header).toEqual({
        'columns': []
      });
      expect(element.isolateScope().rows).toEqual([]);
      expect(element.isolateScope().pagination.count).toEqual(5);
      expect(element.isolateScope().pagination.page).toEqual(1);
      expect(element.isolateScope().pagination.pages).toEqual(1);
      expect(element.isolateScope().pagination.size).toEqual(0);
      expect(element.isolateScope().params.sortBy).toEqual(undefined);
      expect(element.isolateScope().params.sortOrder).toEqual('asc');
      expect(element.isolateScope().params.page).toEqual(1);
      expect(element.isolateScope().params.count).toEqual(undefined);
      expect(element.isolateScope().theadDirective).toEqual(false);
      expect(element.isolateScope().paginationDirective).toEqual(false);
    });

    it('should return the right url after called buildUrl', function () {
      urlToCall = 'api.json?city=sf';
      $httpBackend.whenGET(urlToCall).respond(filtersJSON);
      $timeout.flush();
      $httpBackend.flush();
      $scope.$digest();
      expect(element.isolateScope().rows[0].name).toEqual('Ritual Coffee Roasters');
      expect(element.isolateScope().rows.length).toEqual(35);
    });
  });
});