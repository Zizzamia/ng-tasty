/**
 * @ngdoc directive
 * @name tastyTable
 *
 * @example
  <table tasty-table>
    <tbody></tbody>
  </table>
 *
 */
angular.module('ngTasty.table', [
  'ngTasty.filter.cleanFieldName',
  'ngTasty.filter.range',
  'ngTasty.service.debounce',
  'ngTasty.service.setProperty',
  'ngTasty.service.joinObjects'
])
.constant('tableConfig', {
  query: {
    'page': 'page',
    'count': 'count',
    'sortBy': 'sort-by',
    'sortOrder': 'sort-order',
  },
  resource: undefined
})
.controller('TableController', [
  '$scope', 
  '$attrs',
  'tableConfig',
  'debounce',
  'setProperty',
  'joinObjects',
  function($scope, $attrs, tableConfig, debounce, setProperty, joinObjects) {
    'use strict';
    this.$scope = $scope;

    // Default configs
    $scope.query = tableConfig.query;
    $scope.resource = tableConfig.resource;

    // Set custom configs
    if (angular.isDefined($attrs.query)) {
      $scope.query = $scope.$parent.$eval($attrs.query);
    }
    if (!angular.isDefined($attrs.resource)) {
      throw 'AngularJS tastyTable directive: miss the resource attribute';
    } else {
      $scope.resource = $scope.$parent.$eval($attrs.resource);
      if (!$scope.resource) {
        throw 'AngularJS tastyTable directive: the resource ('+
            $attrs.resource + ') callback it\'s undefined';
      }
    }

    $scope.url = '';
    $scope.header = {
      'columns': []
    };
    $scope.rows = [];
    $scope.params = {};
    $scope.pagination = {};
    $scope.theadDirective = false;
    $scope.paginationDirective = false;

    // In TableController, by using `this` we build an API 
    // for other directives to talk to this one.
    this.activate = function(directiveName) {
      $scope[directiveName + 'Directive'] = true;
      $scope.params[directiveName] = true;
    };

    this.setParams = function(key, value) {
      $scope.params[key] = value;
    };

    $scope.setDirectivesValues = function (resource) {
      if (!resource) {
        return false;
      }
      $scope.rows = resource.rows;
      $scope.header = {
        'columns': resource.header,
        'sortBy': resource.sortBy,
        'sortOrder': resource.sortOrder
      };
      $scope.pagination = resource.pagination;
    };

    $scope.buildUrl = function(params, filters) {
      var urlQuery, value, url;
      urlQuery = {};
      if ($scope.theadDirective) {
        urlQuery = setProperty(urlQuery, params, 'sortBy');
        urlQuery = setProperty(urlQuery, params, 'sortOrder');
      }
      if ($scope.paginationDirective) {
        urlQuery = setProperty(urlQuery, params, 'page');
        urlQuery = setProperty(urlQuery, params, 'count');
      }
      if ($attrs.filters) {
        urlQuery = joinObjects(urlQuery, filters);
      }
      return Object.keys(urlQuery).map(function(key) {
        value = urlQuery[key];
        if ($scope.query[key]) {
          key = $scope.query[key];
        }
        return encodeURIComponent(key) + '=' + encodeURIComponent(value);
      }).join('&');
    };

    $scope.updateResource = debounce(function() {
      $scope.url = $scope.buildUrl($scope.params, $scope[$attrs.filters]);
      $scope[$attrs.resource]($scope.url).then(function (resource) {
        $scope.setDirectivesValues(resource);
      });
    }, 100);

    $scope.initDirective = function () {
      $scope.params['sortBy'] = undefined;
      $scope.params['sortOrder'] = 'asc';
      $scope.params['page'] = 1;
      $scope.params['count'] = 5;
      $scope.updateResource();
    };
    
    // AngularJs $watch callbacks
    if ($attrs.filters) {
      $scope.$watch($attrs.filters, function (newValue, oldValue){
        if (newValue !== oldValue) {
          $scope.updateResource();
        }
      }, true);
    }
    $scope.$watch('params', function (newValue, oldValue){
      if (newValue !== oldValue) {
        $scope.updateResource();
      }
    }, true);
    $scope.initDirective();
  }
])
.directive('tastyTable', function(){
  return {
    restrict: 'A',
    scope: true,
    controller: 'TableController'
  };
})

/**
 * @ngdoc directive
 * @name tastyThead
 *
 * @example
  <table tasty-table>
    <thead table-head></thead>
    <tbody></tbody>
  </table>
 *
 */
.directive('tastyThead', [
  '$filter',
  function($filter) {
    return {
      restrict: 'AE',
      require: '^tastyTable',
      scope: {},
      templateUrl: 'template/table/head.html',
      link: function (scope, element, attrs, tastyTable) {
        'use strict';
        var setFields;

        // Thead it's called
        tastyTable.activate('thead');

        scope.fields = {};

        setFields = function () {
          var lenHeader, i;
          lenHeader = scope.header.columns.length;
          for (i = 0; i < lenHeader; i++) {
            scope.fields[scope.header.columns[i].key] = {
              'width': parseFloat((100 / lenHeader).toFixed(2)),
              'sort': $filter('cleanFieldName')(scope.header.columns[i].key)
            };
          }
          if (scope.header.sortOrder === 'dsc') {
            scope.header.sortBy = '-' + scope.header.sortBy;
          }
        };

        scope.sortBy = function (field) {
          var fieldName;
          fieldName = $filter('cleanFieldName')(field.key);
          if (scope.header.sortBy == fieldName) {
            scope.header.sortBy = '-' + fieldName;
            tastyTable.setParams('sortOrder', 'dsc');
          } else {
            scope.header.sortBy = fieldName;
            tastyTable.setParams('sortOrder', 'asc');
          }
          tastyTable.setParams('sortBy', field.key);
        };

        scope.isSortUp = function(field) {
          if (scope.fields[field.key] === undefined) {
            return false;
          }
          return scope.header.sortBy == '-' + scope.fields[field.key].sort;
        };

        scope.isSortDown = function(field) {
          if (scope.fields[field.key] === undefined) {
            return false;
          }
          return scope.header.sortBy == scope.fields[field.key].sort;
        };

        tastyTable.$scope.$watch('header', function (newValue, oldValue){
          if (newValue && (newValue !== oldValue)) {
            scope.header = newValue;
            setFields();
          }
        });
      }
    };
  }
])

/**
 * @ngdoc directive
 * @name tastyPagination
 *
 * @example
  <div tasty-table>
    <table>
     ...
    </table>
    <div table-pagination></div>
  </div>
 *
 */
.directive('tastyPagination', [
  '$filter',
  function($filter) {
    return {
      restrict: 'AE',
      require: '^tastyTable',
      scope: {},
      templateUrl: 'template/table/pagination.html',
      link: function (scope, element, attrs, tastyTable) {
        'use strict';
        var getPage, setCount, setPaginationRange,
            setPreviousRange, setRemainingRange,
            setPaginationRanges;

        // Pagination it's called
        tastyTable.activate('pagination');

        /* In the future you will have a way to change
         * these values by an isolate optional scope variable,
         * more info here https://github.com/angular/angular.js/issues/6404 */
        scope.numPaginations = 5;
        scope.pagListCount = [5, 25, 50, 100];

        // Internal variable
        scope.pagination = {};
        scope.pagMinRange = 1;
        scope.pagMaxRange = 1;

        getPage = function (numPage) {
          tastyTable.setParams('page', numPage);
        };

        setCount = function(count) {
          var maxItems, page;
          maxItems = count * scope.pagination.page;
          if (maxItems > scope.pagination.size) {
            page = Math.ceil(scope.pagination.size / count);
            tastyTable.setParams('page', page);
          }
          tastyTable.setParams('count', count);
        };

        setPaginationRange = function () {
          var currentPage, totalPages;
          currentPage = scope.pagination.page;
          if (currentPage > scope.pagination.pages) {
            currentPage = scope.pagination.pages;
          }
          scope.pagMinRange = (currentPage - 2) > 0 ? (currentPage - 2) : 1;
          scope.pagMaxRange = (currentPage + 2);
          scope.pagination.page  = currentPage;
          setPaginationRanges();
        };

        setPreviousRange = function () {
          if (scope.pagHideMinRange === true || scope.pagMinRange < 1) {
            return false;
          }
          scope.pagMaxRange = scope.pagMinRange;
          scope.pagMinRange = scope.pagMaxRange - scope.numPaginations;
          setPaginationRanges();
        };

        setRemainingRange = function () {
          if (scope.pagHideMaxRange === true || scope.pagMaxRange > scope.pagination.pages) {
            return false;
          }
          scope.pagMinRange = scope.pagMaxRange;
          scope.pagMaxRange = scope.pagMinRange + scope.numPaginations;
          if (scope.pagMaxRange > scope.pagination.pages) {
            scope.pagMaxRange = scope.pagination.pages;
          }
          scope.pagMinRange = scope.pagMaxRange - scope.numPaginations;
          setPaginationRanges();
        };

        setPaginationRanges =  function () {
          scope.pagMinRange = scope.pagMinRange > 0 ? scope.pagMinRange : 1;
          scope.pagMaxRange = scope.pagMinRange + scope.numPaginations;
          if (scope.pagMaxRange > scope.pagination.pages) {
            scope.pagMaxRange = scope.pagination.pages + 1;
          }
          scope.pagHideMinRange = scope.pagMinRange <= 1;
          scope.pagHideMaxRange = scope.pagMaxRange >= scope.pagination.pages;
          if (scope.pagination.size < 50) {
            scope.pagListCount = [5, 25];
          } else if (scope.pagination.size < 100) {
            scope.pagListCount = [5, 25, 50];
          } else {
            scope.pagListCount = [5, 25, 50, 100];
          }
          scope.rangePage = $filter('range')(scope.pagMinRange, scope.pagMaxRange);
        };

        scope.page = {
          'get': getPage,
          'setCount': setCount,
          'previous': setPreviousRange,
          'remaining': setRemainingRange
        };

        tastyTable.$scope.$watch('pagination', function (newValue, oldValue){
          if (newValue && (newValue !== oldValue)) {
            scope.pagination = newValue;
            setPaginationRange();
          }
        });
      }
    };
  }
]);