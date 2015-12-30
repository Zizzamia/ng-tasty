describe('Component: table', function () {
  var $rootScope, $scope, $httpBackend, $compile, $controller;
  var element, controller, params, urlToCall, filters, createDirective, 
  field, elm, elementSelected, expected, completeJSON, sortingJSON, 
  paginationJSON, filtersJSON, tastyTable, tastyPagination, 
  tastyThead, paginationJSONCount25, tableCtrl;

  beforeEach(module('ngMock'));
  beforeEach(module('ngTasty.filter.cleanFieldName'));
  beforeEach(module('ngTasty.filter.range'));
  beforeEach(module('ngTasty.service.tastyUtil'));
  beforeEach(module('ngTasty.component.table'));
  beforeEach(module('mockedAPIResponse'));
  beforeEach(module('ngTasty.tpls.table.head'));
  beforeEach(module('ngTasty.tpls.table.pagination'));


  describe('configs', function () {
    beforeEach(inject(function ($rootScope, _$compile_) {
      $scope = $rootScope.$new();
      $compile = _$compile_;
    }));

    it('should return a throw message if the bind-resource is not set', function () {
      function errorFunctionWrapper() {
        element = angular.element('<div tasty-table></div>');
        $compile(element)($scope);
        $scope.$digest();
      }
      expected = 'Angular tastyTable directive: need the bind-resource or bind-resource-callback attribute';
      expect(errorFunctionWrapper).toThrow(expected);
    });

    it('should return a throw message if the bind-resource set is undefined', function () {
      function errorFunctionWrapper() {
        element = angular.element('<div tasty-table bind-resource="getResource"></div>');
        $compile(element)($scope);
        $scope.$digest();
      }
      expected = 'Angular tastyTable directive: the bind-resource (getResource) is not an object';
      expect(errorFunctionWrapper).toThrow(expected);
    });
  });

  
  describe('bad bind-resource implementation', function () {
    beforeEach(inject(function ($rootScope, $compile) {
      $scope = $rootScope.$new();
      $scope.resource = {
        'header': [],
        'rows': [],
        'sortBy': 'name',
        'sortOrder': 'asc'
      };
      element = angular.element(''+
      '<div tasty-table bind-resource="resource" bind-filters="filters">'+
      '  <table>'+
      '    <thead tasty-thead></thead>'+
      '    <tbody>'+
      '    </tbody>'+
      '  </table>'+
      '  <div tasty-pagination></div>'+
      '</div>');
      $compile(element)($scope);
    }));

    it('should render the table without no errors', function () {
      $scope.$digest();
    });
  });


  describe('withs sorting', function () {

    beforeEach(inject(function ($rootScope, $compile, _sortingJSON_) {
      $scope = $rootScope.$new();
      $scope.resource = angular.copy(_sortingJSON_);
      $scope.resource.header[2].sortable = false; 
      $scope.resource.something = [
        { 'name': 'Ritual Coffee Roasters' }
      ];
      element = angular.element(''+
      '<table tasty-table bind-resource="resource" watch-resource="collection" '+
      '  bind-theme="theme">'+
      '  <thead tasty-thead></thead>'+
      '  <tbody>'+
      '    <tr ng-repeat="row in rows">'+
      '      <td>{{ row.name }}</td>'+
      '      <td>{{ row.star }}</td>'+
      '      <td>{{ row[\'sf-Location\'] }}</td>'+
      '    </tr>'+
      '  </tbody>'+
      '</table>');
      tastyTable = $compile(element)($scope);
      tastyThead = tastyTable.find('[tasty-thead=""]');
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
      expect(element.scope().header.columns[0]).toEqual({ 
        'key' : 'name', 
        'name' : 'Name',
        'style' : { 'width' : '50%' },
        'class': []
      });
      expect(element.scope().header.columns[1]).toEqual({ 
        'key' : 'star', 
        'name' : 'Star',
        'style' : { 'width' : '20%' },
        'class': [ 'text-right' ]
      });
      expect(element.scope().header.columns[2].key).toEqual('sf-Location');
      expect(element.scope().header.columns[2].name).toEqual('SF Location');
      expect(element.scope().header.columns[2].style).toEqual({ 'width' : '30%' });
      expect(element.scope().header.columns[2].class).toEqual([]);
      expect(element.scope().header.columns.length).toEqual(3);
      expect(element.scope().rows.length).toEqual(34);
      expect(element.scope().pagination.count).toEqual(5);
      expect(element.scope().pagination.page).toEqual(1);
      expect(element.scope().pagination.pages).toEqual(1);
      expect(element.scope().pagination.size).toEqual(0);
      expect(element.scope().params.sortBy).toEqual('name');
      expect(element.scope().params.sortOrder).toEqual('asc');
      expect(element.scope().params.page).toEqual(1);
      expect(element.scope().params.count).toEqual(undefined);
      expect(element.scope().params.thead).toEqual(true);
      expect(element.scope().theadDirective).toEqual(true);
      expect(element.scope().paginationDirective).toEqual(false);   
    });

    it('should return the right url after called buildUrl', function () {
      expect(element.scope().rows[0].name).toEqual('Andytown Coffee Roasters');
      expect(element.scope().rows.length).toEqual(34);
    });

    it('should have these isolateScope value as default', function () {
      expect(tastyThead.isolateScope().columns[0].active).toEqual(true);
      expect(tastyThead.isolateScope().columns[0].sortable).toEqual(true);
      expect(tastyThead.isolateScope().columns[0].style).toEqual({ width : '50%' });
      expect(tastyThead.isolateScope().columns[1].active).toEqual(false);
      expect(tastyThead.isolateScope().columns[1].sortable).toEqual(true);
      expect(tastyThead.isolateScope().columns[1].style).toEqual({ width : '20%' });
      expect(tastyThead.isolateScope().columns[2].active).toEqual(false);
      expect(tastyThead.isolateScope().columns[2].sortable).toEqual(false);
      expect(tastyThead.isolateScope().columns[2].style).toEqual( { width : '30%' });
    });

    it('should set params.sortBy when scope.sortBy is clicked', function () {
      field = {'key': 'name', 'name': 'Name', 'sortable': true};
      tastyThead.isolateScope().sortBy(field);
      $scope.$digest();
      expect(element.scope().params.sortBy).toEqual('name');
      expect($scope.resource.sortBy).toEqual('name');
      expect(tastyThead.isolateScope().columns[0].active).toEqual(true);
      field = {'key': 'star', 'name': 'Star', 'sortable': true};
      tastyThead.isolateScope().sortBy(field);
      $scope.$digest();
      expect(element.scope().params.sortBy).toEqual('star');
      expect($scope.resource.sortBy).toEqual('star');
      expect(tastyThead.isolateScope().columns[1].active).toEqual(true);
    });

    it('should set the sortable property when declared', function () {
      expect(element.scope().header.columns[0].sortable).toEqual(undefined);
      expect(element.scope().header.columns[1].sortable).toEqual(undefined);
      expect(element.scope().header.columns[2].sortable).toEqual(false);
    });

    it('should sorting ascending and descending scope.header.sortBy when scope.sortBy is clicked', function () {
      field = {'key': 'star', 'name': 'star', 'sortable': true};
      tastyThead.isolateScope().sortBy(field);
      $scope.$digest();
      expect(tastyThead.isolateScope().header.sortBy).toEqual('star');
      expect(element.scope().rows[0].name).toEqual('Peet\'s');
      tastyThead.isolateScope().sortBy(field);
      $scope.$digest();
      expect(tastyThead.isolateScope().header.sortBy).toEqual('-star');
      expect(element.scope().rows[0].name).toEqual('Ritual Coffee Roasters');
    });

    it('should sorting ascending and descending with a key contains a dash (-)', function () {
      field = { 'key': 'sf-Location', 'name': 'SF Location', 'sortable': true};
      tastyThead.isolateScope().sortBy(field);
      $scope.$digest();
      expect(tastyThead.isolateScope().header.sortBy).toEqual('sf-Location');
      expect(element.scope().rows[0].name).toEqual('CoffeeShop');
      tastyThead.isolateScope().sortBy(field);
      $scope.$digest();
      expect(tastyThead.isolateScope().header.sortBy).toEqual('-sf-Location');
      expect(element.scope().rows[0].name).toEqual('Flywheel Coffee Roasters');
    });

    it('should return true or false to indicate if a specific key is sorted up', function () {
      field = {'key': 'star', 'name': 'star', 'sortable': true};
      tastyThead.isolateScope().sortBy(field);
      $scope.$digest();
      expect(tastyThead.isolateScope().columns[1].isSorted).toEqual('fa fa-sort-up');
      tastyThead.isolateScope().sortBy(field);
      $scope.$digest();
      expect(tastyThead.isolateScope().columns[1].isSorted).toEqual('fa fa-sort-down');
    });

    it('should return true or false to indicate if a specific key is sorted down', function () {
      field = {'key': 'star', 'name': 'star', 'sortable': true};
      tastyThead.isolateScope().sortBy(field);
      $scope.$digest();
      expect(tastyThead.isolateScope().columns[1].isSorted).toEqual('fa fa-sort-up');
      tastyThead.isolateScope().sortBy(field);
      $scope.$digest();
      expect(tastyThead.isolateScope().columns[1].isSorted).toEqual('fa fa-sort-down');
    });

    it('should return every value in resource inside the table directive scope', function () {
      $scope.$digest();
      expect(element.scope().something[0].name).toEqual('Ritual Coffee Roasters');
    });

    it('should have these element.scope() value after changing them', function () {
      $scope.resource.header = [
        {'key': 'month', 'name': 'Month' },
        {'key': 'id', 'name': 'ID'},
      ];
      $scope.$digest();
      expect(element.scope().header.columns[0]).toEqual({ 
        'key' : 'month', 
        'name' : 'Month',
        'style' : {}, 
        'class' : []
      });
      expect(element.scope().header.columns[1]).toEqual({ 
        'key' : 'id', 
        'name' : 'ID',
        'style' : {}, 
        'class' : []
      });
      expect(element.scope().header.columns.length).toEqual(2);
    });
  });


  describe('withs sorting with custom theme', function () {

    beforeEach(inject(function ($rootScope, $compile, _sortingJSON_) {
      $scope = $rootScope.$new();
      $scope.resource = angular.copy(_sortingJSON_);
      $scope.resource.something = [
        { 'name': 'Ritual Coffee Roasters' }
      ];
      $scope.theme = {
        bindOnce: false
      };
      element = angular.element(''+
      '<table tasty-table bind-resource="resource" watch-resource="collection" '+
      '  bind-theme="theme">'+
      '  <thead tasty-thead></thead>'+
      '  <tbody>'+
      '    <tr ng-repeat="row in rows">'+
      '      <td>{{ row.name }}</td>'+
      '      <td>{{ row.star }}</td>'+
      '      <td>{{ row[\'sf-Location\'] }}</td>'+
      '    </tr>'+
      '  </tbody>'+
      '</table>');
      tastyTable = $compile(element)($scope);
      tastyThead = tastyTable.find('[tasty-thead=""]');
      $scope.$digest();
      tableCtrl = element.controller('tasty-table');
    }));

    it('should bindOnce be false', function () {
      expect(tableCtrl.config.bindOnce).toEqual(false);
    });

    it('should have these element.scope() value as default', function () {
      expect(element.scope().query).toEqual({
        'page': 'page',
        'count': 'count',
        'sortBy': 'sort-by',
        'sortOrder': 'sort-order',
      });
      expect(element.scope().url).toEqual('');
      expect(element.scope().header.columns[0]).toEqual({ 
        'key' : 'name', 
        'name' : 'Name',
        'style' : { 'width' : '50%' },
        'class': []
      });
      expect(element.scope().header.columns[1]).toEqual({ 
        'key' : 'star', 
        'name' : 'Star',
        'style' : { 'width' : '20%' },
        'class': [ 'text-right' ]
      });
      expect(element.scope().header.columns[2].key).toEqual('sf-Location');
      expect(element.scope().header.columns[2].name).toEqual('SF Location');
      expect(element.scope().header.columns[2].style).toEqual({ 'width' : '30%' });
      expect(element.scope().header.columns[2].class).toEqual([]);
      expect(element.scope().header.columns.length).toEqual(3);
      expect(element.scope().rows.length).toEqual(34);
      expect(element.scope().pagination.count).toEqual(5);
      expect(element.scope().pagination.page).toEqual(1);
      expect(element.scope().pagination.pages).toEqual(1);
      expect(element.scope().pagination.size).toEqual(0);
      expect(element.scope().params.sortBy).toEqual('name');
      expect(element.scope().params.sortOrder).toEqual('asc');
      expect(element.scope().params.page).toEqual(1);
      expect(element.scope().params.count).toEqual(undefined);
      expect(element.scope().params.thead).toEqual(true);
      expect(element.scope().theadDirective).toEqual(true);
      expect(element.scope().paginationDirective).toEqual(false);   
    });

    it('should have these element.scope() value after changing them', function () {
      $scope.resource.header = [
        {'key': 'month', 'name': 'Month', 'style' : {}, 'class' : []},
        {'key': 'id', 'name': 'ID', 'style' : {}, 'class' : []},
      ];
      $scope.$digest();
      expect(element.scope().header.columns[0]).toEqual({ 
        'key' : 'month', 
        'name' : 'Month',
        'style' : {}, 
        'class' : []
      });
      expect(element.scope().header.columns[1]).toEqual({ 
        'key' : 'id', 
        'name' : 'ID',
        'style' : {}, 
        'class' : []
      });
      expect(element.scope().header.columns.length).toEqual(2);
    });

    it('should have bind value after changing them', function () {
      var bindList = $(tastyThead).find('[ng-bind]');
      expect(bindList[0].innerHTML).toEqual('Name');
      expect(bindList[1].innerHTML).toEqual('Star');
      expect(bindList.length).toEqual(3);
      $scope.resource.header = [
        {'key': 'month', 'name': 'Month', 'style' : {}, 'class' : []},
        {'key': 'id', 'name': 'ID', 'style' : {}, 'class' : []},
      ];
      $scope.$digest();
      bindList = $(tastyThead).find('[ng-bind]');
      expect(bindList[0].innerHTML).toEqual('Month');
      expect(bindList[1].innerHTML).toEqual('ID');
      expect(bindList.length).toEqual(2);
    });
  });
  

  describe('withs sorting, simplified header version', function () {
    beforeEach(inject(function ($rootScope, $compile, _sortingJSON_) {
      $scope = $rootScope.$new();
      $scope.resource = angular.copy(_sortingJSON_);
      $scope.resource.header = [
        { 'name': 'Name' },
        { 'star': 'Star' },
        { 'sf-Location': 'SF Location' }
      ];
      element = angular.element(''+
      '<table tasty-table bind-resource="resource">'+
      '  <thead tasty-thead></thead>'+
      '  <tbody>'+
      '    <tr ng-repeat="row in rows">'+
      '      <td>{{ row.name }}</td>'+
      '      <td>{{ row.star }}</td>'+
      '      <td>{{ row[\'sf-Location\'] }}</td>'+
      '    </tr>'+
      '  </tbody>'+
      '</table>');
      tastyTable = $compile(element)($scope);
      tastyThead = tastyTable.find('[tasty-thead=""]');
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
      expect(element.scope().header.columns[0]).toEqual({ 
        'key' : 'name', 
        'name' : 'Name',
        'style' : {},
        'class': []
      });
      expect(element.scope().header.columns[1]).toEqual({ 
        'key' : 'star', 
        'name' : 'Star',
        'style' : {},
        'class': []
      });
      expect(element.scope().header.columns[2]).toEqual({ 
        'key' : 'sf-Location', 
        'name' : 'SF Location',
        'style' : {},
        'class': []
      });
      expect(element.scope().header.columns.length).toEqual(3);
      expect(element.scope().rows.length).toEqual(34);
      expect(element.scope().pagination.count).toEqual(5);
      expect(element.scope().pagination.page).toEqual(1);
      expect(element.scope().pagination.pages).toEqual(1);
      expect(element.scope().pagination.size).toEqual(0);
      expect(element.scope().params.sortBy).toEqual('name');
      expect(element.scope().params.sortOrder).toEqual('asc');
      expect(element.scope().params.page).toEqual(1);
      expect(element.scope().params.count).toEqual(undefined);
      expect(element.scope().params.thead).toEqual(true);
      expect(element.scope().theadDirective).toEqual(true);
      expect(element.scope().paginationDirective).toEqual(false);   
    });
  });


  describe('withs filters', function () {
    beforeEach(inject(function ($rootScope, $compile, _sortingJSON_) {
      $scope = $rootScope.$new();
      $scope.resource = angular.copy(_sortingJSON_);
      $scope.filters = 'rit';
      element = angular.element(''+
      '<table tasty-table bind-resource="resource" bind-filters="filters">'+
      '  <thead tasty-thead></thead>'+
      '  <tbody>'+
      '    <tr ng-repeat="row in rows">'+
      '      <td>{{ row.name }}</td>'+
      '      <td>{{ row.star }}</td>'+
      '      <td>{{ row[\'sf-Location\'] }}</td>'+
      '    </tr>'+
      '  </tbody>'+
      '</table>');
      tastyTable = $compile(element)($scope);
      tastyThead = tastyTable.find('[tasty-thead=""]');
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
      expect(element.scope().header.columns.length).toEqual(3);
      expect(element.scope().rows.length).toEqual(1);
      expect(element.scope().pagination.count).toEqual(5);
      expect(element.scope().pagination.page).toEqual(1);
      expect(element.scope().pagination.pages).toEqual(1);
      expect(element.scope().pagination.size).toEqual(0);
      expect(element.scope().params.sortBy).toEqual('name');
      expect(element.scope().params.sortOrder).toEqual('asc');
      expect(element.scope().params.page).toEqual(1);
      expect(element.scope().params.count).toEqual(undefined);
      expect(element.scope().params.thead).toEqual(true);
      expect(element.scope().theadDirective).toEqual(true);
      expect(element.scope().paginationDirective).toEqual(false);   
    });

    it('should filter by string value', function () {
      $scope.filters = '';
      $scope.$digest();
      expect(element.scope().rows.length).toEqual(34);
      $scope.filters = 'rit';
      $scope.$digest();
      expect(element.scope().rows.length).toEqual(1);
      $scope.filters = 'bl';
      $scope.$digest();
      expect(element.scope().rows.length).toEqual(2);
      $scope.filters = 'll';
      $scope.$digest();
      expect(element.scope().rows.length).toEqual(11);
      $scope.filters = '★★★★★';
      $scope.$digest();
      expect(element.scope().rows.length).toEqual(6);
    });
  });

  
  describe('bad bind-filters-comparator implementation', function () {
    beforeEach(inject(function ($rootScope, $compile, _sortingJSON_) {
      $scope = $rootScope.$new();
      $scope.resource = angular.copy(_sortingJSON_);
      $scope.filters = 'ha';
      $scope.filtersComparator = function (actual, expected) {
        if (actual.indexOf) {
          return actual.toLowerCase().indexOf(expected) === 0;
        }
      };
      element = angular.element(''+
      '<div tasty-table bind-resource="resource" bind-filters="filters" '+
      '  bind-filters-comparator="filtersComparator">'+
      '  <table>'+
      '    <thead tasty-thead></thead>'+
      '    <tbody>'+
      '    </tbody>'+
      '  </table>'+
      '</div>');
      $compile(element)($scope);
      $scope.$digest();
    }));

    it('should be defined the value of filtersComparator', function () {
      $scope.$digest();
      expect(element.scope().filtersComparator).toBeDefined();
    });

    it('should have these element.scope() value as default', function () {
      expect(element.scope().query).toEqual({
        'page': 'page',
        'count': 'count',
        'sortBy': 'sort-by',
        'sortOrder': 'sort-order',
      });
      expect(element.scope().url).toEqual('');
      expect(element.scope().header.columns.length).toEqual(3);
      expect(element.scope().rows.length).toEqual(2);
      expect(element.scope().pagination.count).toEqual(5);
      expect(element.scope().pagination.page).toEqual(1);
      expect(element.scope().pagination.pages).toEqual(1);
      expect(element.scope().pagination.size).toEqual(0);
      expect(element.scope().params.sortBy).toEqual('name');
      expect(element.scope().params.sortOrder).toEqual('asc');
      expect(element.scope().params.page).toEqual(1);
      expect(element.scope().params.count).toEqual(undefined);
      expect(element.scope().params.thead).toEqual(true);
      expect(element.scope().theadDirective).toEqual(true);
      expect(element.scope().paginationDirective).toEqual(false);   
    });

    it('should filter by string value', function () {
      $scope.filters = '';
      $scope.$digest();
      expect(element.scope().rows.length).toEqual(34);
      $scope.filters = 'rit';
      $scope.$digest();
      expect(element.scope().rows.length).toEqual(1);
      $scope.filters = 'bl';
      $scope.$digest();
      expect(element.scope().rows.length).toEqual(2);
      $scope.filters = 'll';
      $scope.$digest();
      expect(element.scope().rows.length).toEqual(0);
      $scope.filters = '★★★★★';
      $scope.$digest();
      expect(element.scope().rows.length).toEqual(6);
    });
  });


  describe('withs filters and pagination', function () {
    beforeEach(inject(function ($rootScope, $compile, _sortingJSON_) {
      $scope = $rootScope.$new();
      $scope.resource = angular.copy(_sortingJSON_);
      $scope.filters = 'rit';
      element = angular.element(''+
      '<div tasty-table bind-resource="resource" bind-filters="filters">'+
      '  <table>'+
      '    <thead tasty-thead></thead>'+
      '    <tbody>'+
      '      <tr ng-repeat="row in rows">'+
      '        <td>{{ row.name }}</td>'+
      '        <td>{{ row.star }}</td>'+
      '        <td>{{ row[\'sf-Location\'] }}</td>'+
      '      </tr>'+
      '    </tbody>'+
      '  </table>'+
      '  <tasty-pagination></tasty-pagination>'+
      '</div>');
      tastyTable = $compile(element)($scope);
      tastyThead = tastyTable.find('[tasty-thead=""]');
      tastyPagination = tastyTable.find('tasty-pagination');
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
      expect(element.scope().header.columns.length).toEqual(3);
      expect(element.scope().rows.length).toEqual(1);
      expect(element.scope().pagination.count).toEqual(5);
      expect(element.scope().pagination.page).toEqual(1);
      expect(element.scope().pagination.pages).toEqual(1);
      expect(element.scope().pagination.size).toEqual(1);
      expect(element.scope().params.sortBy).toEqual('name');
      expect(element.scope().params.sortOrder).toEqual('asc');
      expect(element.scope().params.page).toEqual(1);
      expect(element.scope().params.count).toEqual(5);
      expect(element.scope().params.thead).toEqual(true);
      expect(element.scope().theadDirective).toEqual(true);
      expect(element.scope().paginationDirective).toEqual(true);   
    });

    it('should filter by string value', function () {
      $scope.filters = '';
      $scope.$digest();
      expect(element.scope().rows.length).toEqual(5);
      $scope.filters = 'rit';
      $scope.$digest();
      expect(element.scope().rows.length).toEqual(1);
      $scope.filters = 'bl';
      $scope.$digest();
      expect(element.scope().rows.length).toEqual(2);
      $scope.filters = 'll';
      $scope.$digest();
      expect(element.scope().rows.length).toEqual(5);
      $scope.filters = '★★★★★';
      $scope.$digest();
      expect(element.scope().rows.length).toEqual(5);
    });

    it('should filter after change page', function () {
      tastyPagination.isolateScope().page.get(2);
      $scope.filters = '';
      $scope.$digest();
      expect(element.scope().rows.length).toEqual(5);
      $scope.filters = 'rit';
      $scope.$digest();
      expect(element.scope().rows.length).toEqual(1);
      $scope.filters = 'bl';
      $scope.$digest();
      expect(element.scope().rows.length).toEqual(2);
      $scope.filters = 'll';
      $scope.$digest();
      expect(element.scope().rows.length).toEqual(5);
      $scope.filters = '★★★★★';
      $scope.$digest();
      expect(element.scope().rows.length).toEqual(5);
    });

    it('should filter after change page', function () {
      tastyPagination.isolateScope().page.get(2);
      $scope.filters = '';
      $scope.$digest();
      expect(element.scope().rows.length).toEqual(5);
      $scope.filters = 's';
      $scope.$digest();
      tastyPagination.isolateScope().page.get(3);
      $scope.$digest();
      $scope.filters = 'bar';
      $scope.$digest();
      expect(element.scope().pagination.page).toEqual(1);
      expect(element.scope().params.page).toEqual(1);
      expect(element.scope().rows.length).toEqual(5);
    });
  });


  describe('withs filters and pagination with bad settings', function () {
    beforeEach(inject(function ($rootScope, $compile, _sortingJSON_) {
      $scope = $rootScope.$new();
      $scope.resource = angular.copy(_sortingJSON_);
      $scope.resource.pagination.page = 4;
      $scope.filters = 'rit';
      element = angular.element(''+
      '<div tasty-table bind-resource="resource" bind-filters="filters">'+
      '  <table>'+
      '    <thead tasty-thead></thead>'+
      '    <tbody>'+
      '      <tr ng-repeat="row in rows">'+
      '        <td>{{ row.name }}</td>'+
      '        <td>{{ row.star }}</td>'+
      '        <td>{{ row[\'sf-Location\'] }}</td>'+
      '      </tr>'+
      '    </tbody>'+
      '  </table>'+
      '  <tasty-pagination></tasty-pagination>'+
      '</div>');
      tastyTable = $compile(element)($scope);
      tastyThead = tastyTable.find('[tasty-thead=""]');
      tastyPagination = tastyTable.find('tasty-pagination');
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
      expect(element.scope().header.columns.length).toEqual(3);
      expect(element.scope().rows.length).toEqual(1);
      expect(element.scope().pagination.count).toEqual(5);
      expect(element.scope().pagination.page).toEqual(1);
      expect(element.scope().pagination.pages).toEqual(1);
      expect(element.scope().pagination.size).toEqual(1);
      expect(element.scope().params.sortBy).toEqual('name');
      expect(element.scope().params.sortOrder).toEqual('asc');
      expect(element.scope().params.page).toEqual(1);
      expect(element.scope().params.count).toEqual(5);
      expect(element.scope().params.thead).toEqual(true);
      expect(element.scope().theadDirective).toEqual(true);
      expect(element.scope().paginationDirective).toEqual(true);   
    });
  });


  describe('with basic pagination', function () {
    beforeEach(inject(function ($rootScope, $compile) {
      $scope = $rootScope.$new();
      $scope.resource = {
        'header': [
          { 'key': 'name', 'name': 'Name' },
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
      '<div tasty-table bind-resource="resource">'+
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
      $scope.$digest();
    }));

    it('should have these element.scope() value after 100ms', function () {
      expect(element.scope().query).toEqual({
        'page': 'page',
        'count': 'count',
        'sortBy': 'sort-by',
        'sortOrder': 'sort-order',
      });
      expect(element.scope().url).toEqual('');
      expect(element.scope().header.columns.length).toEqual(3);
      expect(element.scope().rows.length).toEqual(1);
      expect(element.scope().pagination.count).toEqual(5);
      expect(element.scope().pagination.page).toEqual(1);
      expect(element.scope().pagination.pages).toEqual(1);
      expect(element.scope().pagination.size).toEqual(1);
      expect(element.scope().params.sortBy).toEqual(undefined);
      expect(element.scope().params.sortOrder).toEqual(undefined);
      expect(element.scope().params.page).toEqual(1);
      expect(element.scope().params.count).toEqual(5);
      expect(element.scope().params.pagination).toEqual(true);
      expect(element.scope().theadDirective).toEqual(false);
      expect(element.scope().paginationDirective).toEqual(true);
    });

    it('should return the right url after called buildUrl', function () {
      expect(element.scope().rows[0].name).toEqual('Ritual Coffee Roasters');
      expect(element.scope().rows.length).toEqual(1);
    });

    it('should have these isolateScope value as default', function () {
      expect(tastyPagination.isolateScope().pagination.count).toEqual(5);
      expect(tastyPagination.isolateScope().pagination.page).toEqual(1);
      expect(tastyPagination.isolateScope().pagination.pages).toEqual(1);
      expect(tastyPagination.isolateScope().pagination.size).toEqual(1);
      expect(tastyPagination.isolateScope().listItemsPerPageShow).toEqual([]);
      expect(tastyPagination.isolateScope().pagMinRange).toEqual(1);
      expect(tastyPagination.isolateScope().pagMaxRange).toEqual(2);
    });

    it('should generate page count button using ng-repeat', function () {
      elementSelected = element.find('[ng-repeat="count in listItemsPerPageShow"]');
      expect(elementSelected.length).toEqual(0);
    });
  });


  describe('with pagination', function () {
    beforeEach(inject(function ($rootScope, $compile, _sortingJSON_) {
      $scope = $rootScope.$new();
      $scope.resource = angular.copy(_sortingJSON_);
      $scope.itemsPerPage = 10;
      $scope.listItemsPerPage = [5, 10, 20, 40, 80];
      element = angular.element(''+
      '<div tasty-table bind-resource="resource">'+
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
      '  <tasty-pagination bind-items-per-page="itemsPerPage" '+
      '  bind-list-items-per-page="listItemsPerPage"></tasty-pagination>'+
      '</div>');
      tastyTable = $compile(element)($scope);
      tastyPagination = tastyTable.find('tasty-pagination');
      $scope.$digest();
    }));

    it('should have these element.scope() value after 100ms', function () {
      expect(element.scope().query).toEqual({
        'page': 'page',
        'count': 'count',
        'sortBy': 'sort-by',
        'sortOrder': 'sort-order',
      });
      expect(element.scope().url).toEqual('');
      expect(element.scope().header.columns.length).toEqual(3);
      expect(element.scope().rows.length).toEqual(10);
      expect(element.scope().pagination.count).toEqual(10);
      expect(element.scope().pagination.page).toEqual(1);
      expect(element.scope().pagination.pages).toEqual(4);
      expect(element.scope().pagination.size).toEqual(34);
      expect(element.scope().params.sortBy).toEqual('name');
      expect(element.scope().params.sortOrder).toEqual('asc');
      expect(element.scope().params.page).toEqual(1);
      expect(element.scope().params.count).toEqual(10);
      expect(element.scope().params.pagination).toEqual(true);
      expect(element.scope().theadDirective).toEqual(false);
      expect(element.scope().paginationDirective).toEqual(true);
    });

    it('should return the right url after called buildUrl', function () {
      expect(element.scope().rows[0].name).toEqual('Andytown Coffee Roasters');
      expect(element.scope().rows.length).toEqual(10);
    });

    it('should have these isolateScope value as default', function () {
      expect(tastyPagination.isolateScope().pagination.count).toEqual(10);
      expect(tastyPagination.isolateScope().pagination.page).toEqual(1);
      expect(tastyPagination.isolateScope().pagination.pages).toEqual(4);
      expect(tastyPagination.isolateScope().pagination.size).toEqual(34);
      expect(tastyPagination.isolateScope().listItemsPerPageShow).toEqual([5, 10, 20, 40]);
      expect(tastyPagination.isolateScope().pagMinRange).toEqual(1);
      expect(tastyPagination.isolateScope().pagMaxRange).toEqual(5);
    });

    it('should generate page count button using ng-repeat', function () {
      elementSelected = element.find('[ng-repeat="count in listItemsPerPageShow"]');
      expect(elementSelected.length).toEqual(4);
    });
    
    it('should use correct class for the selected page count', function () {
      elementSelected = element.find('[ng-repeat="count in listItemsPerPageShow"]');
      expect(elementSelected.eq(0)).not.toHaveClass('active');
      expect(elementSelected.eq(1)).toHaveClass('active');
      expect(elementSelected.eq(2)).not.toHaveClass('active');
      tastyPagination.isolateScope().page.setCount(20);
      $scope.$digest();
      expect(tastyPagination.isolateScope().pagination.count).toEqual(20);
      expect(tastyPagination.isolateScope().pagination.page).toEqual(1);
      expect(tastyPagination.isolateScope().pagination.pages).toEqual(2);
      expect(tastyPagination.isolateScope().pagination.size).toEqual(34);
      expect(elementSelected.eq(0)).not.toHaveClass('active');
      expect(elementSelected.eq(1)).not.toHaveClass('active');
      expect(elementSelected.eq(2)).toHaveClass('active');
    });
    
    it('should update params.page when page.get is clicked', function () {
      tastyPagination.isolateScope().page.get(1);
      $scope.$digest();
      expect(element.scope().params.page).toEqual(1);
      expect(element.scope().resource.pagination.page).toEqual(1);
      tastyPagination.isolateScope().page.get(2);
      $scope.$digest();
      expect(element.scope().params.page).toEqual(2);
      expect(element.scope().resource.pagination.page).toEqual(2);
      tastyPagination.isolateScope().page.get(4);
      $scope.$digest();
      expect(element.scope().params.page).toEqual(4);
      expect(element.scope().resource.pagination.page).toEqual(4);
      tastyPagination.isolateScope().page.get(1);
      $scope.$digest();
      expect(element.scope().params.page).toEqual(1);
      expect(element.scope().resource.pagination.page).toEqual(1);
    });
    
    it('should update params.count when page.setCount is clicked', function () {
      tastyPagination.isolateScope().page.setCount(25);
      expect(element.scope().params.count).toEqual(25);
      expect(element.scope().params.page).toEqual(1);
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


  describe('with pagination count 1', function () {
    beforeEach(inject(function ($rootScope, $compile, _sortingJSON_) {
      $scope = $rootScope.$new();
      $scope.resource = angular.copy(_sortingJSON_);
      $scope.itemsPerPage = 1;
      $scope.listItemsPerPage = [1, 10, 20, 40, 80];
      element = angular.element(''+
      '<div tasty-table bind-resource="resource">'+
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
      '  <tasty-pagination bind-items-per-page="itemsPerPage" '+
      '  bind-list-items-per-page="listItemsPerPage"></tasty-pagination>'+
      '</div>');
      tastyTable = $compile(element)($scope);
      tastyPagination = tastyTable.find('tasty-pagination');
      $scope.$digest();
    }));

    it('should update pagMinRange and pagMaxRange when page.previous and page.remaining are clicked', function () {
      expect(tastyPagination.isolateScope().pagMinRange).toEqual(1);
      expect(tastyPagination.isolateScope().pagMaxRange).toEqual(6);
      tastyPagination.isolateScope().page.previous();
      expect(tastyPagination.isolateScope().pagMinRange).toEqual(1);
      expect(tastyPagination.isolateScope().pagMaxRange).toEqual(6);
      tastyPagination.isolateScope().page.remaining();
      expect(tastyPagination.isolateScope().pagMinRange).toEqual(6);
      expect(tastyPagination.isolateScope().pagMaxRange).toEqual(11);
      tastyPagination.isolateScope().page.remaining();
      expect(tastyPagination.isolateScope().pagMinRange).toEqual(11);
      expect(tastyPagination.isolateScope().pagMaxRange).toEqual(16);
      tastyPagination.isolateScope().page.remaining();
      expect(tastyPagination.isolateScope().pagMinRange).toEqual(16);
      expect(tastyPagination.isolateScope().pagMaxRange).toEqual(21);
      tastyPagination.isolateScope().page.previous();
      expect(tastyPagination.isolateScope().pagMinRange).toEqual(11);
      expect(tastyPagination.isolateScope().pagMaxRange).toEqual(16);
      tastyPagination.isolateScope().page.previous();
      expect(tastyPagination.isolateScope().pagMinRange).toEqual(6);
      expect(tastyPagination.isolateScope().pagMaxRange).toEqual(11);
    });

    it('should update rangePage when page.previous and page.remaining are clicked', function () {
      expect(tastyPagination.isolateScope().rangePage).toEqual([1,2,3,4,5]);
      tastyPagination.isolateScope().page.previous();
      expect(tastyPagination.isolateScope().rangePage).toEqual([1,2,3,4,5]);
      tastyPagination.isolateScope().page.remaining();
      expect(tastyPagination.isolateScope().rangePage).toEqual([6,7,8,9,10]);
      tastyPagination.isolateScope().page.remaining();
      expect(tastyPagination.isolateScope().rangePage).toEqual([11,12,13,14,15]);
      tastyPagination.isolateScope().page.previous();
      expect(tastyPagination.isolateScope().rangePage).toEqual([6,7,8,9,10]);
      tastyPagination.isolateScope().page.previous();
      expect(tastyPagination.isolateScope().rangePage).toEqual([1,2,3,4,5]);
    });
  });


  describe('with pagination classic binding', function () {
    beforeEach(inject(function ($rootScope, $compile, _sortingJSON_) {
      $scope = $rootScope.$new();
      $scope.resource = angular.copy(_sortingJSON_);
      element = angular.element(''+
      '<div tasty-table bind-resource="resource">'+
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
      '  <tasty-pagination items-per-page="10" '+
      '  list-items-per-page="[5, 10, 20, 40, 80]"></tasty-pagination>'+
      '</div>');
      tastyTable = $compile(element)($scope);
      tastyPagination = tastyTable.find('tasty-pagination');
      $scope.$digest();
    }));

    it('should have these element.scope() value after 100ms', function () {
      expect(element.scope().query).toEqual({
        'page': 'page',
        'count': 'count',
        'sortBy': 'sort-by',
        'sortOrder': 'sort-order',
      });
      expect(element.scope().url).toEqual('');
      expect(element.scope().header.columns.length).toEqual(3);
      expect(element.scope().rows.length).toEqual(10);
      expect(element.scope().pagination.count).toEqual(10);
      expect(element.scope().pagination.page).toEqual(1);
      expect(element.scope().pagination.pages).toEqual(4);
      expect(element.scope().pagination.size).toEqual(34);
      expect(element.scope().params.sortBy).toEqual('name');
      expect(element.scope().params.sortOrder).toEqual('asc');
      expect(element.scope().params.page).toEqual(1);
      expect(element.scope().params.count).toEqual(10);
      expect(element.scope().params.pagination).toEqual(true);
      expect(element.scope().theadDirective).toEqual(false);
      expect(element.scope().paginationDirective).toEqual(true);
    });

    it('should return the right url after called buildUrl', function () {
      expect(element.scope().rows[0].name).toEqual('Andytown Coffee Roasters');
      expect(element.scope().rows.length).toEqual(10);
    });

    it('should have these isolateScope value as default', function () {
      expect(tastyPagination.isolateScope().pagination.count).toEqual(10);
      expect(tastyPagination.isolateScope().pagination.page).toEqual(1);
      expect(tastyPagination.isolateScope().pagination.pages).toEqual(4);
      expect(tastyPagination.isolateScope().pagination.size).toEqual(34);
      expect(tastyPagination.isolateScope().listItemsPerPageShow).toEqual([5, 10, 20, 40]);
      expect(tastyPagination.isolateScope().pagMinRange).toEqual(1);
      expect(tastyPagination.isolateScope().pagMaxRange).toEqual(5);
    });

    it('should generate page count button using ng-repeat', function () {
      elementSelected = element.find('[ng-repeat="count in listItemsPerPageShow"]');
      expect(elementSelected.length).toEqual(4);
    });
    
    it('should use correct class for the selected page count', function () {
      elementSelected = element.find('[ng-repeat="count in listItemsPerPageShow"]');
      expect(elementSelected.eq(0)).not.toHaveClass('active');
      expect(elementSelected.eq(1)).toHaveClass('active');
      expect(elementSelected.eq(2)).not.toHaveClass('active');
      tastyPagination.isolateScope().page.setCount(20);
      $scope.$digest();
      expect(tastyPagination.isolateScope().pagination.count).toEqual(20);
      expect(tastyPagination.isolateScope().pagination.page).toEqual(1);
      expect(tastyPagination.isolateScope().pagination.pages).toEqual(2);
      expect(tastyPagination.isolateScope().pagination.size).toEqual(34);
      expect(elementSelected.eq(0)).not.toHaveClass('active');
      expect(elementSelected.eq(1)).not.toHaveClass('active');
      expect(elementSelected.eq(2)).toHaveClass('active');
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

  
  describe('with pagination template-url binding', function () {
    beforeEach(inject(function ($rootScope, $compile, _$httpBackend_, _sortingJSON_) {
      $scope = $rootScope.$new();
      $scope.resource = angular.copy(_sortingJSON_);
      $httpBackend = _$httpBackend_;
      element = angular.element(''+
      '<div tasty-table bind-resource="resource">'+
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
      '  <tasty-pagination template-url="my-template.html"></tasty-pagination>'+
      '</div>');
      tastyTable = $compile(element)($scope);
      tastyPagination = tastyTable.find('tasty-pagination');
    }));

    it('should request the template', function () {
      $httpBackend.whenGET('my-template.html').respond('<div class="row"></div>');
      $httpBackend.flush();
      $scope.$digest();
    });
  });
  

  describe('withs tableConfig changed', function () {
    beforeEach(function () {
      angular.mock.module('ngTasty.component.table', function ($provide) {
        $provide.constant('tableConfig', {
          init: {
            'count': 5,
            'page': 1,
            'sortBy': undefined,
            'sortOrder': undefined
          },
          query: {
            'page': 'page',
            'count': 'count',
            'sortBy': 'sort-by',
            'sortOrder': 'sort-order'
          },
          bindOnce: true,
          iconUp: 'fa fa-sort-up',
          iconDown: 'fa fa-sort-down',
          bootstrapIcon: true,
          templateHeadUrl: 'template/table/head.html',
          templateUrl: 'template/table/pagination.html',
          listItemsPerPage: [5, 25, 50, 100],
          itemsPerPage: 5,
          watchResource: 'reference'
        });
      });
    });

    beforeEach(inject(function ($rootScope, $compile, _sortingJSON_) {
      $scope = $rootScope.$new();
      $scope.resource = angular.copy(_sortingJSON_);
      element = angular.element(''+
      '<table tasty-table bind-resource="resource">'+
      '  <thead tasty-thead></thead>'+
      '  <tbody>'+
      '    <tr ng-repeat="row in rows">'+
      '      <td>{{ row.name }}</td>'+
      '      <td>{{ row.star }}</td>'+
      '      <td>{{ row[\'sf-Location\'] }}</td>'+
      '    </tr>'+
      '  </tbody>'+
      '</table>');
      tastyTable = $compile(element)($scope);
      tastyThead = tastyTable.find('[tasty-thead=""]');
      $scope.$digest();
    }));

    it('should return true or false to indicate if a specific key is sorted up', function () {
      field = {'key': 'star', 'name': 'star', 'sortable': true};
      tastyThead.isolateScope().sortBy(field);
      $scope.$digest();
      expect(tastyThead.isolateScope().columns[1].isSorted).toEqual('dropup');
      tastyThead.isolateScope().sortBy(field);
      $scope.$digest();
      expect(tastyThead.isolateScope().columns[1].isSorted).toEqual('');
    });

    it('should return true or false to indicate if a specific key is sorted down', function () {
      field = {'key': 'star', 'name': 'star', 'sortable': true};
      tastyThead.isolateScope().sortBy(field);
      $scope.$digest();
      expect(tastyThead.isolateScope().columns[1].isSorted).toEqual('dropup');
      tastyThead.isolateScope().sortBy(field);
      $scope.$digest();
      expect(tastyThead.isolateScope().columns[1].isSorted).toEqual('');
    });
  });

  
  describe('withs watchResource changed', function () {

    beforeEach(inject(function ($rootScope, $compile, _sortingJSON_, _completeJSON_) {
      $scope = $rootScope.$new();
      $scope.resource = angular.copy(_sortingJSON_);
      $scope.resourceTwo = angular.copy(_completeJSON_);
    }));

    it('should return watchResource reference as default', function () {
      element = angular.element('<table tasty-table bind-resource="resource" '+
                                'bind-watch-resource="watchResource"></table>');
      tastyTable = $compile(element)($scope);
      $scope.$digest();

      expect($scope.resource.rows.length).toEqual(element.scope().rows.length);
      expect(element.scope().watchResource).toEqual('reference');
      expect(element.scope().logs.buildClientResourceCount).toEqual(1);
      $scope.resource.rows.push({'name': 'Coffee', 'star': '★★★', 'sf-location': ''});
      $scope.$digest();

      expect(element.scope().logs.buildClientResourceCount).toEqual(1);
      $scope.resource.rows[0].star = '★★★★★';
      $scope.$digest();

      expect(element.scope().logs.buildClientResourceCount).toEqual(1);
      $scope.resource = $scope.resourceTwo;
      $scope.$digest();

      expect(element.scope().logs.buildClientResourceCount).toEqual(2);
      $scope.resource.reload();
      $scope.$digest();

      expect(element.scope().logs.buildClientResourceCount).toEqual(3);
    });

    it('should watch only the collection', function () {
      $scope.watchResource = 'collection';
      element = angular.element('<table tasty-table bind-resource="resource" '+
                                'bind-watch-resource="watchResource"></table>');
      tastyTable = $compile(element)($scope);
      $scope.$digest();

      expect($scope.resource.rows.length).toEqual(element.scope().rows.length);
      expect(element.scope().watchResource).toEqual('collection');
      expect(element.scope().logs.buildClientResourceCount).toEqual(1);
      $scope.resource.rows.push({'name': 'Coffee', 'star': '★★★', 'sf-location': ''});
      $scope.$digest();

      expect(element.scope().logs.buildClientResourceCount).toEqual(2);
      $scope.resource.rows[0].star = '★★★★★';
      $scope.$digest();

      expect(element.scope().logs.buildClientResourceCount).toEqual(2);
      $scope.resource = $scope.resourceTwo;
      $scope.$digest();

      expect(element.scope().logs.buildClientResourceCount).toEqual(5);
      $scope.resource.reload();
      $scope.$digest();

      expect(element.scope().logs.buildClientResourceCount).toEqual(6);
    });

    it('should watch only the collection by passing by plain text', function () {
      element = angular.element('<table tasty-table bind-resource="resource" '+
                                'watch-resource="collection"></table>');
      tastyTable = $compile(element)($scope);
      $scope.$digest();

      expect($scope.resource.rows.length).toEqual(element.scope().rows.length);
      expect(element.scope().watchResource).toEqual('collection');
      expect(element.scope().logs.buildClientResourceCount).toEqual(1);
      $scope.resource.rows.push({'name': 'Coffee', 'star': '★★★', 'sf-location': ''});
      $scope.$digest();

      expect(element.scope().logs.buildClientResourceCount).toEqual(2);
      $scope.resource.rows[0].star = '★★★★★';
      $scope.$digest();

      expect(element.scope().logs.buildClientResourceCount).toEqual(2);
      $scope.resource = $scope.resourceTwo;
      $scope.$digest();

      expect(element.scope().logs.buildClientResourceCount).toEqual(5);
      $scope.resource.reload();
      $scope.$digest();

      expect(element.scope().logs.buildClientResourceCount).toEqual(6);
    });

    it('should watch only the equality', function () {
      $scope.watchResource = 'equality';
      element = angular.element('<table tasty-table bind-resource="resource" '+
                                'bind-watch-resource="watchResource"></table>');
      tastyTable = $compile(element)($scope);
      $scope.$digest();

      expect($scope.resource.rows.length).toEqual(element.scope().rows.length);
      expect(element.scope().watchResource).toEqual('equality');
      expect(element.scope().logs.buildClientResourceCount).toEqual(1);
      $scope.resource.rows.push({'name': 'Coffee', 'star': '★★★', 'sf-location': ''});
      $scope.$digest();

      expect(element.scope().logs.buildClientResourceCount).toEqual(2);
      $scope.resource.rows[0].star = '★★★★★';
      $scope.$digest();

      expect(element.scope().logs.buildClientResourceCount).toEqual(3);
      $scope.resource = $scope.resourceTwo;
      $scope.$digest();

      expect(element.scope().logs.buildClientResourceCount).toEqual(8);
      expect(element.scope().resource.reload).not.toEqual(undefined);
    });

    it('should watch only the equality by plain text', function () {
      element = angular.element('<table tasty-table bind-resource="resource" '+
                                'watch-resource="equality"></table>');
      tastyTable = $compile(element)($scope);
      $scope.$digest();

      expect($scope.resource.rows.length).toEqual(element.scope().rows.length);
      expect(element.scope().watchResource).toEqual('equality');
      expect(element.scope().logs.buildClientResourceCount).toEqual(1);
      $scope.resource.rows.push({'name': 'Coffee', 'star': '★★★', 'sf-location': ''});
      $scope.$digest();

      expect(element.scope().logs.buildClientResourceCount).toEqual(2);
      $scope.resource.rows[0].star = '★★★★★';
      $scope.$digest();

      expect(element.scope().logs.buildClientResourceCount).toEqual(3);
      $scope.resource = $scope.resourceTwo;
      $scope.$digest();

      expect(element.scope().logs.buildClientResourceCount).toEqual(8);
      expect(element.scope().resource.reload).not.toEqual(undefined);
    });
  });


  describe('withs sorting and different theme', function () {
    beforeEach(inject(function ($rootScope, $compile, _sortingJSON_) {
      $scope = $rootScope.$new();
      $scope.resource = angular.copy(_sortingJSON_);
      $scope.resource.something = [
        { 'name': 'Ritual Coffee Roasters' }
      ];
      $scope.theme = {
        iconUp: 'active is-desc',
        iconDown: 'active is-asc'
      };
      element = angular.element(''+
      '<table tasty-table bind-resource="resource" bind-theme="theme">'+
      '  <thead tasty-thead></thead>'+
      '  <tbody>'+
      '    <tr ng-repeat="row in rows">'+
      '      <td>{{ row.name }}</td>'+
      '      <td>{{ row.star }}</td>'+
      '      <td>{{ row[\'sf-Location\'] }}</td>'+
      '    </tr>'+
      '  </tbody>'+
      '</table>');
      tastyTable = $compile(element)($scope);
      tastyThead = tastyTable.find('[tasty-thead=""]');
      $rootScope.$digest();
      tableCtrl = element.controller('tasty-table');
    }));

    it('should bindOnce be true', function () {
      expect(tableCtrl.config.bindOnce).toEqual(true);
    });

    it('should return true or false to indicate if a specific key is sorted up', function () {
      field = {'key': 'star', 'name': 'star', 'sortable': true};
      tastyThead.isolateScope().sortBy(field);
      $scope.$digest();
      expect(tastyThead.isolateScope().columns[1].isSorted).toEqual('active is-desc');
      tastyThead.isolateScope().sortBy(field);
      $scope.$digest();
      expect(tastyThead.isolateScope().columns[1].isSorted).toEqual('active is-asc');
    });

    it('should return true or false to indicate if a specific key is sorted down', function () {
      field = {'key': 'star', 'name': 'star', 'sortable': true};
      tastyThead.isolateScope().sortBy(field);
      $scope.$digest();
      expect(tastyThead.isolateScope().columns[1].isSorted).toEqual('active is-desc');
      tastyThead.isolateScope().sortBy(field);
      $scope.$digest();
      expect(tastyThead.isolateScope().columns[1].isSorted).toEqual('active is-asc');
    });
  });


  describe('withs sorting with wrong fields', function () {
    var sortingJSON;

    beforeEach(inject(function ($rootScope, _$compile_, _sortingJSON_) {
      $scope = $rootScope.$new();
      $compile = _$compile_;
      sortingJSON = _sortingJSON_;
    }));

    it('should bindOnce be false', function () {
      function errorFunctionWrapper() {
        $scope.resource = angular.copy(sortingJSON);
        $scope.resource.header.push({});
        element = angular.element(''+
        '<table tasty-table bind-resource="resource" watch-resource="collection" >'+
        '  <thead tasty-thead></thead>'+
        '  <tbody>'+
        '    <tr ng-repeat="row in rows">'+
        '      <td>{{ row.name }}</td>'+
        '      <td>{{ row.star }}</td>'+
        '      <td>{{ row[\'sf-Location\'] }}</td>'+
        '    </tr>'+
        '  </tbody>'+
        '</table>');
        $compile(element)($scope);
        $scope.$digest();
      }
      expected = 'Angular tastyTable directive: need a key value each column table header';
      expect(errorFunctionWrapper).toThrow(expected);
    });
  });
});