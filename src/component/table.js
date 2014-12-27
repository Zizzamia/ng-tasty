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
angular.module('ngTasty.component.table', [
  'ngTasty.filter.cleanFieldName',
  'ngTasty.filter.range',
  'ngTasty.service.tastyUtil',
  'ngTasty.tpls.table.head',
  'ngTasty.tpls.table.pagination'
])
.constant('tableConfig', {
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
  bootstrapIcon: false,
  templateUrl: 'template/table/pagination.html',
  listItemsPerPage: [5, 25, 50, 100],
  itemsPerPage: 5
})
.controller('TableController', function($scope, $attrs, $filter, tableConfig, tastyUtil) {
  'use strict';
  var listScopeToWatch, initTable, newScopeName, initStatus,
      updateClientSideResource, updateServerSideResource, setDirectivesValues,
      buildClientResource, buildUrl;
  this.$scope = $scope;
  initStatus = {};
  $scope.init = {};
  $scope.query = {};

  listScopeToWatch = ['bindFilters', 'bindInit', 'bindQuery', 'bindResource', 
  'bindResourceCallback'];
  listScopeToWatch.forEach(function (scopeName) {
    newScopeName = scopeName.substring(4);
    newScopeName = newScopeName.charAt(0).toLowerCase() + newScopeName.slice(1);
    if ($attrs[scopeName]) {
      tastyUtil.bindTo(scopeName, $scope, $attrs, newScopeName);
    }
  });

  // Default configs
  $scope.query.page = $scope.query.page || tableConfig.query.page;
  $scope.query.count = $scope.query.count || tableConfig.query.count;
  $scope.query.sortBy = $scope.query.sortBy || tableConfig.query.sortBy;
  $scope.query.sortOrder = $scope.query.sortOrder || tableConfig.query.sortOrder;
  $scope.init.count = $scope.init.count || tableConfig.init.count;
  $scope.init.page = $scope.init.page || tableConfig.init.page;
  $scope.init.sortBy = $scope.init.sortBy || tableConfig.init.sortBy;
  $scope.init.sortOrder = $scope.init.sortOrder || tableConfig.init.sortOrder;

  // Defualt variables
  var listImmutableKey =[
    'filters',
    'init',
    'query',
    'rows',
    'header',
    'pagination',
    'params',
    'sortOrder',
    'sortBy',
    'url'
  ];
  $scope.clientSide = true;
  $scope.url = '';
  $scope.header = {
    'columns': []
  };
  $scope.rows = [];
  $scope.params = {};
  $scope.pagination = {
    'count': $scope.init.count,
    'page': $scope.init.page,
    'pages': 1,
    'size': 0
  };
  $scope.theadDirective = false;
  $scope.paginationDirective = false; 

  /* Set custom configs
   * In the future you will have a way to change
   * these values by an isolate optional scope variable,
   * more info here https://github.com/angular/angular.js/issues/6404 */
  if (!angular.isDefined($attrs.bindResource) && !angular.isDefined($attrs.bindResourceCallback)) {
    throw 'AngularJS tastyTable directive: need the bind-resource or bind-resource-callback attribute';
  }
  if (angular.isDefined($attrs.bindResource)) {
    if (!angular.isObject($scope.resource)) {
      throw 'AngularJS tastyTable directive: the bind-resource ('+
        $attrs.bindResource + ') it\'s not an object';
    } else if (!$scope.resource.header && !$scope.resource.rows) {
      throw 'AngularJS tastyTable directive: the bind-resource ('+
        $attrs.bindResource + ') has the property header or rows undefined';
    }
  }
  if (angular.isDefined($attrs.bindResourceCallback)) {
    if (!angular.isFunction($scope.resourceCallback)) {
      throw 'AngularJS tastyTable directive: the bind-resource-callback ('+
        $attrs.bindResourceCallback + ') it\'s not a function';
    }
    $scope.clientSide = false;
  }   

  // In TableController, by using `this` we build an API 
  // for other directives to talk to this one.
  this.start = false;

  this.activate = function(directiveName) {
    $scope[directiveName + 'Directive'] = true;
    $scope.params[directiveName] = true;
  };

  this.setParams = function(key, value) {
    $scope.params[key] = value;
    if (['sortBy', 'sortOrder'].indexOf(key) >= 0) {
      $scope.header[key] = value;
    }
  };

  this.initTable = function (keyDirective) {
    initStatus[keyDirective] = true;
    if (!$scope.theadDirective && !$scope.paginationDirective) {
      this.start = true;
    } else if ($scope.theadDirective && $scope.paginationDirective) {
      if (initStatus.thead && initStatus.pagination){
        this.start = true;
      }
    } else if ($scope.theadDirective && !$scope.paginationDirective) {
      if (initStatus.thead){
        this.start = true;
      }
    } else if (!$scope.theadDirective && $scope.paginationDirective) {
      if (initStatus.pagination){
        this.start = true;
      }
    }

    if (this.start) {
      if ($scope.clientSide) {
        $scope.params.sortBy = $scope.resource.sortBy || $scope.init.sortBy;
        $scope.params.sortOrder = $scope.resource.sortOrder || $scope.init.sortOrder;
        $scope.params.page = $scope.init.page;
        if ($scope.resource.pagination) {
          $scope.params.page = $scope.resource.pagination.page || $scope.init.page;
        }
        $scope.$evalAsync(updateClientSideResource);
      } else {
        $scope.params.sortBy = $scope.init.sortBy;
        $scope.params.sortOrder = $scope.init.sortOrder;
        $scope.params.page = $scope.init.page;
        $scope.$evalAsync(updateServerSideResource);
      }
    }
  };

  this.bindOnce = tableConfig.bindOnce;

  setDirectivesValues = function (resource) {
    if (!angular.isObject(resource)) {
      throw 'AngularJS tastyTable directive: the bind-resource '+
            'it\'s not an object';
    } else if (!resource.header && !resource.rows) {
      throw 'AngularJS tastyTable directive: the bind-resource '+
            'has the property header or rows undefined';
    }
    Object.keys(resource).forEach(function(key) {
      if (listImmutableKey.indexOf(key) < 0) {
        $scope[key] = resource[key];
      }
    });
    // Assuming if one header uses just one key it's based on the new pattern.
    // [feature request] simplified header for resources #37 by @WebReflection
    if (resource.header.length && Object.keys(resource.header[0]).length === 1) {
      resource.header = resource.header.map(function (header) {
        var key = Object.keys(header)[0];
        return {
          key: key,
          name: header[key]
        };
      });
    }
    $scope.header = {
      'columns': resource.header,
      'sortBy': $scope.params.sortBy,
      'sortOrder': $scope.params.sortOrder
    };
    if (!$scope.clientSide) {
      $scope.header.sortBy = $scope.header.sortBy || resource.sortBy;
      $scope.header.sortOrder = $scope.header.sortOrder || resource.sortOrder;
    }
    $scope.rows = resource.rows;
    if ($scope.paginationDirective) {
      $scope.pagination.page = $scope.params.page;
      $scope.pagination.count = $scope.params.count;
      $scope.pagination.size = $scope.rows.length;
      if (resource.pagination) {
        if (resource.pagination.count) {
          $scope.pagination.count = resource.pagination.count;
        }
        if (resource.pagination.page) {
          $scope.pagination.page = resource.pagination.page;
        }
        if (resource.pagination.size) {
          $scope.pagination.size = resource.pagination.size;
        }
      }
      $scope.pagination.pages = Math.ceil($scope.pagination.size / $scope.pagination.count);
    }
  };

  buildClientResource = function(updateFrom) {
    var fromRow, toRow, rowToShow, reverse, listSortBy;
    if ($scope.theadDirective && $scope.header.columns.length) {
      reverse = $scope.header.sortOrder === 'asc' ? false : true;
      listSortBy = [function(item) {
        return item[$scope.header.sortBy];
      }];
      if ($scope.header.columns[0].key !== $scope.header.sortBy) {
        listSortBy.push(function(item) {
          return item[$scope.header.columns[0].key];
        });
      }
      if ($scope.header.sortBy) {
        $scope.rows = $filter('orderBy')($scope.rows, listSortBy, reverse);
      }
    }
    if ($attrs.bindFilters) {
      $scope.rows = $filter('filter')($scope.rows, $scope.filters);
    }
    if ($scope.paginationDirective) {
      if (updateFrom === 'filters') {
        $scope.pagination.page = 1;
      } else {
        $scope.pagination.page = $scope.params.page;
      }
      $scope.pagination.count = $scope.params.count;
      $scope.pagination.size = $scope.rows.length;
      $scope.pagination.pages = Math.ceil($scope.rows.length / $scope.pagination.count);
      toRow = $scope.pagination.count * $scope.pagination.page;
      fromRow = toRow - $scope.pagination.count;
      if (fromRow >= 0 && toRow >= 0) {
        rowToShow = $scope.rows.slice(fromRow, toRow);
        $scope.rows = rowToShow;
      }
    }
  };

  buildUrl = function(params, filters) {
    var urlQuery, value, url, listKeyNotJoin;
    urlQuery = {};
    listKeyNotJoin = ['sortBy', 'sortOrder', 'page', 'count'];
    if ($scope.theadDirective) {
      urlQuery = tastyUtil.setProperty(urlQuery, params, 'sortBy');
      urlQuery = tastyUtil.setProperty(urlQuery, params, 'sortOrder');
    }
    if ($scope.paginationDirective) {
      urlQuery = tastyUtil.setProperty(urlQuery, params, 'page');
      urlQuery = tastyUtil.setProperty(urlQuery, params, 'count');
    }
    if ($attrs.bindFilters) {
      urlQuery = tastyUtil.joinObjects(urlQuery, filters, listKeyNotJoin);
    }
    return Object.keys(urlQuery).map(function(key) {
      value = urlQuery[key];
      if ($scope.query[key]) {
        key = $scope.query[key];
      }
      return encodeURIComponent(key) + '=' + encodeURIComponent(value);
    }).join('&');
  };

  updateClientSideResource = function (updateFrom) {
    setDirectivesValues($scope.resource);
    buildClientResource(updateFrom);
  };

  updateServerSideResource = function () {
    $scope.url = buildUrl($scope.params, $scope.filters);
    $scope.resourceCallback($scope.url, angular.copy($scope.params)).then(function (resource) {
      setDirectivesValues(resource);
    });
  };
  
  // AngularJs $watch callbacks
  if ($attrs.bindFilters) {
    $scope.$watch('filters', function watchFilters (newValue, oldValue){
      if (newValue !== oldValue) {
        if ($scope.clientSide) {
          $scope.$evalAsync(updateClientSideResource('filters'));
        } else {
          $scope.$evalAsync(updateServerSideResource);
        }
      }
    }, true);
  }
  $scope.$watchCollection('params', function watchParams (newValue, oldValue){
    if (newValue !== oldValue) {
      if ($scope.clientSide) {
        $scope.$evalAsync(updateClientSideResource('params'));
      } else {
        $scope.$evalAsync(updateServerSideResource);
      }
    }
  });
  if ($scope.resource) {
    $scope.$watch('resource', function watchResource (newValue, oldValue){
      if (newValue !== oldValue) {
        $scope.params.sortBy = newValue.sortBy;
        $scope.params.sortOrder = newValue.sortOrder;
        $scope.$evalAsync(updateClientSideResource('resource'));
      }
    }, true);
  }
})
.directive('tastyTable', function(){
  return {
    restrict: 'A',
    scope: true,
    controller: 'TableController',
    link: function postLink(scope, element, attrs, tastyTable) {
      if (element.find('tasty-thead').length ||
          element[0].querySelector('[tasty-thead]')) {
        tastyTable.activate('thead');
      }
      if (element.find('tasty-pagination').length ||
          element[0].querySelector('[tasty-pagination]')) {
        tastyTable.activate('pagination');
      }
      tastyTable.initTable();
    }
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
.directive('tastyThead', function($filter, tableConfig, tastyUtil) {
  return {
    restrict: 'AE',
    require: '^tastyTable',
    scope: {},
    templateUrl: 'template/table/head.html',
    link: function postLink(scope, element, attrs, tastyTable) {
      'use strict';
      var newScopeName, listScopeToWatch;
      scope.bindOnce = tastyTable.bindOnce;
      scope.columns = [];
      scope.bootstrapIcon = tableConfig.bootstrapIcon;
      scope.iconUp = tableConfig.iconUp;
      scope.iconDown = tableConfig.iconDown;

      listScopeToWatch = ['bindNotSortBy', 'bindBootstrapIcon', 'bindIconUp', 'bindIconDown'];
      listScopeToWatch.forEach(function (scopeName) {
        newScopeName = scopeName.substring(4);
        newScopeName = newScopeName.charAt(0).toLowerCase() + newScopeName.slice(1);
        if (attrs[scopeName]) {
          tastyUtil.bindTo(scopeName, scope, attrs, newScopeName);
        } else if (attrs[newScopeName]) {
          if (attrs[newScopeName][0] === '[') {
            scope[newScopeName] = JSON.parse(attrs[newScopeName]);
          } else {
            scope[newScopeName] = attrs[newScopeName];
          }
        }
      });

      scope.setColumns = function () {
        var lenHeader, width, i, active, sortable, sort, 
        isSorted, isSortedCaret;
        scope.columns = [];
        lenHeader = scope.header.columns.length;
        scope.header.columns.forEach(function (column, index) {
          column.style = column.style || {};
          sortable = true;
          active = false;
          isSorted = '';
          isSortedCaret = '';
          // Not sort column when the key is present in the `notSortBy` list,
          // and Not sort column when `notSortBy` is an empty list
          if (angular.isArray(scope.notSortBy)) {
            if (scope.notSortBy.length) {
              sortable = scope.notSortBy.indexOf(column.key) < 0;
            } else {
              sortable = false;
            }
          }
          if (column.key === scope.header.sortBy ||
              '-' + column.key === scope.header.sortBy) {
            active = true;
          }
          sort = $filter('cleanFieldName')(column.key);
          if (scope.header.sortBy === '-' + sort) {
            if (tableConfig.bootstrapIcon) {
              isSorted = '';
              isSortedCaret = 'caret';
            } else {
              isSorted = scope.iconDown;
            }
          } else if (scope.header.sortBy === sort) {
            if (tableConfig.bootstrapIcon) {
              isSorted = 'dropup';
              isSortedCaret = 'caret';
            } else {
              isSorted = scope.iconUp;
            }
          }
          scope.columns.push({
            'key': column.key,
            'name': column.name,
            'active': active,
            'sortable': sortable,
            'style': column.style,
            'isSorted': isSorted,
            'isSortedCaret': isSortedCaret
          });
        });
        if (scope.header.sortOrder === 'dsc' && 
            scope.header.sortBy &&
            scope.header.sortBy[0] !== '-') {
          scope.header.sortBy = '-' + scope.header.sortBy;
        }
        if (!tastyTable.start) {
          // Thead it's called
          tastyTable.initTable('thead');
        }
      };

      scope.sortBy = function (column) {
        if (!column.sortable) {
          return false;
        }
        var columnName, sortOrder;
        columnName = $filter('cleanFieldName')(column.key);
        if (scope.header.sortBy === columnName) {
          sortOrder = 'dsc';
        } else {
          sortOrder = 'asc';
        }
        tastyTable.setParams('sortBy', column.key);
        tastyTable.setParams('sortOrder', sortOrder);
      };

      scope.classToShow = function (column) {
        var listClassToShow = [];
        if (column.sortable) {
          listClassToShow.push('sortable');
        }
        if (column.active) {
          listClassToShow.push('active');
        }
        return listClassToShow;
      };

      tastyTable.$scope.$watchCollection('header', function watchHeader (newValue, oldValue){
        if (newValue  && ((newValue !== oldValue) || !tastyTable.start)) {
          scope.header = newValue;
          scope.setColumns();
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
.directive('tastyPagination', function($filter, $templateCache, $http, $compile, tableConfig, tastyUtil) {
  return {
    restrict: 'AE',
    require: '^tastyTable',
    scope: {},
    templateUrl: function(tElement, tAttrs) {
      return tAttrs.templateUrl || tableConfig.templateUrl;
    },
    link: function postLink(scope, element, attrs, tastyTable) {
      'use strict';
      var getPage, setCount, setPaginationRange, setPreviousRange, 
          setRemainingRange, setPaginationRanges, listScopeToWatch, newScopeName;

      listScopeToWatch = ['bindItemsPerPage', 'bindListItemsPerPage', 'bindTemplateUrl'];
      listScopeToWatch.forEach(function (scopeName) {
        newScopeName = scopeName.substring(4);
        newScopeName = newScopeName.charAt(0).toLowerCase() + newScopeName.slice(1);
        if (attrs[scopeName]) {
          tastyUtil.bindTo(scopeName, scope, attrs, newScopeName);
        } else if (attrs[newScopeName]) {
          if (newScopeName === 'itemsPerPage') {
            scope[newScopeName] = parseInt(attrs[newScopeName]);
          } else {
            scope[newScopeName] = JSON.parse(attrs[newScopeName]);
          }
        }
      });

      if (scope.templateUrl) {
        $http.get(scope.templateUrl, { cache: $templateCache })
        .success(function(templateContent) {
          element.replaceWith($compile(templateContent)(scope));                
        });
      }

      // Default configs
      scope.itemsPerPage = scope.itemsPerPage || tableConfig.itemsPerPage;
      scope.listItemsPerPage = scope.listItemsPerPage || tableConfig.listItemsPerPage;

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
        scope.pagMinRange = scope.pagMaxRange - scope.itemsPerPage;
        setPaginationRanges();
      };

      setRemainingRange = function () {
        if (scope.pagHideMaxRange === true || scope.pagMaxRange > scope.pagination.pages) {
          return false;
        }
        scope.pagMinRange = scope.pagMaxRange;
        scope.pagMaxRange = scope.pagMinRange + scope.itemsPerPage;
        if (scope.pagMaxRange > scope.pagination.pages) {
          scope.pagMaxRange = scope.pagination.pages;
        }
        scope.pagMinRange = scope.pagMaxRange - scope.itemsPerPage;
        setPaginationRanges();
      };

      setPaginationRanges =  function () {
        scope.listItemsPerPageShow = [];
        scope.pagMinRange = scope.pagMinRange > 0 ? scope.pagMinRange : 1;
        scope.pagMaxRange = scope.pagMinRange + 5;
        if (scope.pagMaxRange > scope.pagination.pages) {
          scope.pagMaxRange = scope.pagination.pages + 1;
        }
        scope.pagHideMinRange = scope.pagMinRange <= 1;
        scope.pagHideMaxRange = scope.pagMaxRange >= scope.pagination.pages;
        scope.classPageMinRange = scope.pagHideMinRange ? 'disabled' : '';
        scope.classPageMaxRange = scope.pagHideMaxRange ? 'disabled' : '';

        for (var i = scope.listItemsPerPage.length; i >= 0; i--) {
          if (scope.pagination.size > scope.listItemsPerPage[i]) {
            scope.listItemsPerPageShow = scope.listItemsPerPage.slice(0, (i + 1));
            break;
          }
        }

        scope.rangePage = $filter('range')([], scope.pagMinRange, scope.pagMaxRange);

        if (!tastyTable.start) {
          // Pagination it's called
          tastyTable.initTable('pagination');
        }
      };

      scope.classPaginationCount = function (count) {
        if (count == scope.pagination.count) {
          return 'active';
        }
        return '';
      };

      scope.classNumPage = function (numPage) {
        if (numPage == scope.pagination.page) {
          return 'active';
        }
        return false;
      };

      scope.page = {
        'get': getPage,
        'setCount': setCount,
        'previous': setPreviousRange,
        'remaining': setRemainingRange
      };

      tastyTable.$scope.$watchCollection('pagination', function watchPagination (newValue, oldValue){
        if (newValue  && ((newValue !== oldValue) || !tastyTable.start)) {
          scope.pagination = newValue;
          setPaginationRange();
        }
      });

      // Init Pagination
      scope.page.setCount(scope.itemsPerPage);
    }
  };
});
