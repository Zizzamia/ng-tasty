'use strict';

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
angular.module('tastyTable', [])
.directive('tastyTable', [
  '$rootScope',
  function($rootScope){
    return {
      restrict: 'A',
      scope: true,
      controller: function ($scope) {
        this.$scope = $scope;
      },
      link: function(scope, element, attrs) {
        var resource, setDirectivesValues;

        scope.rows = [];
        scope.header = {
          'columns': []
        };
        scope.resourceQuery = {
          'page': 1,
          'count': 5,
          'sortBy': undefined,
          'sortOrder': 'asc'
        };
        scope.resourcePagination = {};

        setDirectivesValues = function (resource) {
          if (!resource) {
            return false;
          }
          scope.rows = resource.rows;
          scope.header = {
            'columns': resource.header,
            'sortBy': resource.sortBy
          }
          scope.resourcePagination = resource.pagination;
        };

        // AngularJs $watch callbacks
        scope.$watch('resourceQuery', function (newValue, oldValue){
          if (newValue !== oldValue) {
            scope[attrs.resource](newValue, scope[attrs.filterBy]).then(function (resource) {
              setDirectivesValues(resource);
            });
          }
        }, true);

        if (attrs.filterBy) {
          scope.$watch(attrs.filterBy, function (newValue, oldValue){
            if (newValue !== oldValue) {
              scope[attrs.resource](scope.resourceQuery, newValue).then(function (resource) {
                setDirectivesValues(resource);
              });
            }
          }, true);
        }

        // Init
        scope[attrs.resource](scope.resourceQuery, scope[attrs.filterBy]).then(function (resource) {
          setDirectivesValues(resource);
        });
      }
    };
  }
])

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
  '$rootScope',
  function($rootScope) {
    return {
      restrict: "AE",
      require: '^tastyTable',
      templateUrl: '../template/tasty-head.html',
      link: function (scope, element, attrs, appTable) {
        var cleanFieldName, setFields, init;
        scope.fields = {};
        init = true;

        cleanFieldName =  function (key) {
          return key.replace(/[^a-zA-Z0-9-]+/g, '-').toLowerCase();
        }

        setFields = function () {
          var lenHeader, i;
          lenHeader = scope.header.columns.length;
          for (i = 0; i < lenHeader; i++) {
            scope.fields[scope.header.columns[i].key] = {
              'width': 100 / lenHeader,
              'sort': cleanFieldName(scope.header.columns[i].key)
            };
          }
          if (appTable.$scope.resourceQuery.sortOrder === 'dsc') {
            scope.header.sortBy = '-' + scope.header.sortBy;
          }
        }

        scope.sortBy = function (field) {
          var fieldName;
          fieldName = cleanFieldName(field.key)
          if (scope.header.sortBy == fieldName) {
            scope.header.sortBy = '-' + fieldName;
            appTable.$scope.resourceQuery.sortOrder = 'dsc';
          } else {
            scope.header.sortBy = fieldName;
            appTable.$scope.resourceQuery.sortOrder = 'asc';
          }
          appTable.$scope.resourceQuery.sortBy = field.key;
        };

        scope.isSortUp = function(field) {
          if (scope.fields[field.key] === undefined) {
            return false;
          }
          return scope.header.sortBy == '-' + scope.fields[field.key].sort;
        }

        scope.isSortDown = function(field) {
          if (scope.fields[field.key] === undefined) {
            return false;
          }
          return scope.header.sortBy == scope.fields[field.key].sort;
        }

        appTable.$scope.$watch('header', function (newValue, oldValue){
          if (newValue && (newValue !== oldValue || init === true)) {
            scope.header = appTable.$scope.header;
            setFields()
            init = false;
          }
        });
      }
    }
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
  '$rootScope',
  function($rootScope) {
    return {
      restrict: "AE",
      require: '^tastyTable',
      templateUrl: '../template/tasty-pagination.html',
      link: function (scope, element, attrs, appTable) {
        var setPaginationRange, setPreviousRange, setRemainingRange, 
            setPaginationRanges, NUM_PAGINATIONS, init, range;
        NUM_PAGINATIONS = 5;
        scope.pagination = {};
        scope.pagListCount = [5, 25, 50, 100];
        scope.pagMinRange = 1;
        scope.pagMaxRange =  1;
        init = true;

        range = function(min, max) {
          var list;
          list = [];
          min = parseInt(min, 10); 
          max = parseInt(max, 10);
          for (var i = min; i < max; i++) {
            list.push(i);
          }
          return list;
        }

        setPaginationRange = function () {
          var currentPage, totalPages;
          currentPage = scope.pagination.page;
          if (currentPage > scope.pagination.pages) {
            currentPage = scope.pagination.pages;
          }
          scope.pagMinRange = (currentPage - 2) > 0 ? (currentPage - 2) : 1;
          scope.pagMaxRange = (currentPage + 2)
          scope.pagination.page  = currentPage;
          setPaginationRanges();
        }

        setPreviousRange = function () {
          if (scope.pagHideMinRange === true || scope.pagMinRange < 1) {
            return false;
          }
          scope.pagMaxRange = scope.pagMinRange;
          scope.pagMinRange = scope.pagMaxRange - NUM_PAGINATIONS;
          setPaginationRanges();
        }

        setRemainingRange = function () {
          if (scope.pagHideMaxRange === true || scope.pagMaxRange > scope.pagination.pages) {
            return false;
          }
          scope.pagMinRange = scope.pagMaxRange;
          scope.pagMaxRange = scope.pagMinRange + NUM_PAGINATIONS;
          if (scope.pagMaxRange > scope.pagination.pages) {
            scope.pagMaxRange = scope.pagination.pages;
          }
          scope.pagMinRange = scope.pagMaxRange - NUM_PAGINATIONS;
          setPaginationRanges();
        }

        setPaginationRanges =  function () {
          scope.pagMinRange = scope.pagMinRange > 0 ? scope.pagMinRange : 1;
          scope.pagMaxRange = scope.pagMinRange + NUM_PAGINATIONS;
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
          scope.rangePage = range(scope.pagMinRange, scope.pagMaxRange);
        }

        scope.page = {
          'get': function (numPage) {
            appTable.$scope.resourceQuery.page = numPage;
          },
          'setCount': function(count) {
            var maxItems;
            maxItems = count * scope.pagination.page;
            if (maxItems > scope.pagination.size) { 
              appTable.$scope.resourceQuery.page = Math.ceil(scope.pagination.size / count);
            }
            appTable.$scope.resourceQuery.count = count;
          },
          'previous': function() {
            setPreviousRange();
          },
          'remaining': function() {
            setRemainingRange();
          }
        }

        appTable.$scope.$watch('resourcePagination', function (newValue, oldValue){
          if (newValue && (newValue !== oldValue || init == true)) {
            scope.pagination = {
              'count': newValue.count, 
              'page': newValue.page, 
              'pages': newValue.pages, 
              'size': newValue.size
            }
            setPaginationRange()
            init = false;
          }
        });
      }
    }
  }
]);
