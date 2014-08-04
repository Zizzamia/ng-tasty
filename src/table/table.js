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
angular.module('ngTasty.table', [])
.directive('tastyTable', ['$timeout', function($timeout){
  return {
    restrict: 'A',
    scope: true,
    controller: function ($scope) {
      this.$scope = $scope;
    },
    link: function(scope, element, attrs) {
      'use strict';
      var resource, setDirectivesValues, setProperty, joinObjects,
          buildUrl, updateResourceWatch, initParamsWatch;

      if (!attrs.resource) {
        throw 'AngularJS tastyTable directive: miss the resource attribute';
      } else if (!scope[attrs.resource]) {
        throw 'AngularJS tastyTable directive: the resource ('+
              attrs.resource + ') callback it\'s undefined';
      }

      scope.query = {
        'page': 'page',
        'count': 'count',
        'sortBy': 'sort-by',
        'sortOrder': 'sort-order',
      };

      scope.header = {
        'columns': []
      };
      scope.rows = [];
      scope.params = {};
      
      scope.thead = false;
      scope.pagination = false;
      scope.resourcePagination = {};
      scope.url = '';

      setDirectivesValues = function (resource) {
        if (!resource) {
          return false;
        }
        scope.rows = resource.rows;
        scope.header = {
          'columns': resource.header,
          'sortBy': resource.sortBy,
          'sortOrder': resource.sortOrder
        };
        scope.resourcePagination = resource.pagination;
      };

      setProperty = function(objOne, objTwo, attrname) {
        if (objTwo[attrname]) {
          objOne[attrname] = objTwo[attrname];
        }
        return objOne;
      };

      joinObjects = function(objOne, objTwo) {
        for (var attrname in objTwo) {
          setProperty(objOne, objTwo, attrname);
        }
        return objOne;
      };

      buildUrl = function(params, filters) {
        var urlQuery, value, url;
        urlQuery = {};
        if (scope.thead) {
          urlQuery = setProperty(urlQuery, params, 'sortBy');
          urlQuery = setProperty(urlQuery, params, 'sortOrder');
        }
        if (scope.pagination) {
          urlQuery = setProperty(urlQuery, params, 'page');
          urlQuery = setProperty(urlQuery, params, 'count');
        }
        if (attrs.filters) {
          urlQuery = joinObjects(urlQuery, filters);
        }
        return Object.keys(urlQuery).map(function(key) {
          value = urlQuery[key];
          if (scope.query[key]) {
            key = scope.query[key];
          }
          return encodeURIComponent(key) + '=' + encodeURIComponent(value);
        }).join('&');
      };

      updateResourceWatch = function (newValue, oldValue){
        if (newValue !== oldValue) {
          scope.url = buildUrl(scope.params, scope[attrs.filters]);
          scope[attrs.resource](scope.url).then(function (resource) {
            setDirectivesValues(resource);
          });
        }
      };

      $timeout(function() {
        scope.params['sortBy'] = undefined;
        scope.params['sortOrder'] = 'asc';
        scope.params['page'] = 1;
        scope.params['count'] = 5;
      }, 100);

      // AngularJs $watch callbacks
      if (attrs.filters) {
        scope.$watch(attrs.filters, updateResourceWatch, true);
      }
      scope.$watch('params', updateResourceWatch, true);
    }
  };
}])

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
.directive('tastyThead', function() {
  return {
    restrict: 'AE',
    require: '^tastyTable',
    scope: {},
    templateUrl: 'template/table/tasty-head.html',
    link: function (scope, element, attrs, tastyTable) {
      'use strict';
      var cleanFieldName, setFields, init;

      // Thead it's called
      tastyTable.$scope.thead = true;

      scope.fields = {};
      init = true;

      cleanFieldName =  function (key) {
        return key.replace(/[^a-zA-Z0-9-]+/g, '-').toLowerCase();
      };

      setFields = function () {
        var lenHeader, i;
        lenHeader = scope.header.columns.length;
        for (i = 0; i < lenHeader; i++) {
          scope.fields[scope.header.columns[i].key] = {
            'width': 100 / lenHeader,
            'sort': cleanFieldName(scope.header.columns[i].key)
          };
        }
        if (scope.header.sortOrder === 'dsc') {
          scope.header.sortBy = '-' + scope.header.sortBy;
        }
      };

      scope.sortBy = function (field) {
        var fieldName;
        fieldName = cleanFieldName(field.key);
        if (scope.header.sortBy == fieldName) {
          scope.header.sortBy = '-' + fieldName;
          tastyTable.$scope.params.sortOrder = 'dsc';
        } else {
          scope.header.sortBy = fieldName;
          tastyTable.$scope.params.sortOrder = 'asc';
        }
        tastyTable.$scope.params.sortBy = field.key;
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
          scope.header = tastyTable.$scope.header;
          setFields();
        }
      });
    }
  };
})

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
.directive('tastyPagination', function() {
  return {
    restrict: 'AE',
    require: '^tastyTable',
    scope: {},
    templateUrl: 'template/table/tasty-pagination.html',
    link: function (scope, element, attrs, tastyTable) {
      'use strict';
      var getPage, setCount, setPaginationRange,
          setPreviousRange, setRemainingRange,
          setPaginationRanges, init, range;

      // Pagination it's called
      tastyTable.$scope.pagination = true;

      /* In the future you will have a way to change
       * these values by an isolate optional scope variable,
       * more info here https://github.com/angular/angular.js/issues/6404 */
      scope.numPaginations = 5;
      scope.pagListCount = [5, 25, 50, 100];

      // Internal variable
      scope.pagination = {};
      scope.pagMinRange = 1;
      scope.pagMaxRange = 1;
      init = true;

      // Range helper function
      range = function(min, max) {
        var list;
        list = [];
        min = parseInt(min, 10);
        max = parseInt(max, 10);
        for (var i = min; i < max; i++) {
          list.push(i);
        }
        return list;
      };

      getPage = function (numPage) {
        tastyTable.$scope.params.page = numPage;
      };

      setCount = function(count) {
        var maxItems;
        maxItems = count * scope.pagination.page;
        if (maxItems > scope.pagination.size) {
          tastyTable.$scope.params.page = Math.ceil(scope.pagination.size / count);
        }
        tastyTable.$scope.params.count = count;
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
        scope.rangePage = range(scope.pagMinRange, scope.pagMaxRange);
      };

      scope.page = {
        'get': getPage,
        'setCount': setCount,
        'previous': setPreviousRange,
        'remaining': setRemainingRange
      };

      tastyTable.$scope.$watch('resourcePagination', function (newValue, oldValue){
        if (newValue && (newValue !== oldValue)) {
          scope.pagination = {
            'count': newValue.count,
            'page': newValue.page,
            'pages': newValue.pages,
            'size': newValue.size
          };
          setPaginationRange();
        }
      });
    }
  };
});