/**
 * @ngdoc directive
 * @name ngTasty.component.tastyTable
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
    'sortOrder': undefined,
    'filterBase': 1
  },
  query: {
    'page': 'page',
    'count': 'count',
    'sortBy': 'sort-by',
    'sortOrder': 'sort-order'
  },
  bootstrapIcon: false,
  bindOnce: true,
  loadOnInit: false,
  iconUp: 'fa fa-sort-up',
  iconDown: 'fa fa-sort-down',
  listItemsPerPage: [5, 25, 50, 100],
  itemsPerPage: 5,
  templateHeadUrl: 'template/table/head.html',
  templateUrl: 'template/table/pagination.html',
  watchResource: 'reference'
})
.controller('TableController', function($scope, $attrs, $filter, tableConfig, tastyUtil) {
  var listScopeToWatch, initTable, newScopeName, initStatus,
      updateClientSideResource, updateServerSideResource, setDirectivesValues,
      buildClientResource, buildUrl, paramsInitialCycle, initNow, loadOnInit,
      filterChangedPage;
  var vm = this;
  vm.$scope = $scope;
  initStatus = {};
  initNow = true;
  paramsInitialCycle = true;
  $scope.init = {};
  $scope.query = {};
  $scope.logs = {
    'buildClientResourceCount': 0,
    'updateServerSideResourceRunning': 0
  };
  $scope.theme = {};

  // Each one of them is a possible attribute to start watching
  listScopeToWatch = [
    'bindFilters', 
    'bindFiltersComparator',
    'bindInit', 
    'bindQuery', 
    'bindResource', 
    'bindResourceCallback', 
    'bindWatchResource', 
    'bindReload',
    'bindTheme'
  ];
  listScopeToWatch.forEach(function (scopeName) {
    newScopeName = scopeName.substring(4);
    newScopeName = newScopeName.charAt(0).toLowerCase() + newScopeName.slice(1);
    if ($attrs[scopeName]) {
      tastyUtil.bindTo(scopeName, $scope, $attrs, newScopeName);
    } else if ($attrs[newScopeName] && newScopeName === 'watchResource') {
      $scope[newScopeName] = $attrs[newScopeName];
    } else if ($attrs[newScopeName] && newScopeName === 'filtersComparator') {
      $scope[newScopeName] = JSON.parse($attrs[newScopeName]);
    }
  });

  // Default theme
  vm.config = {};
  if (angular.isObject($scope.theme)) {
    Object.keys(tableConfig).forEach(function(key) {
      if (angular.isDefined($scope.theme[key])) {
        vm.config[key] = $scope.theme[key];
      } else {
        vm.config[key] = tableConfig[key];
      }
    }, vm);
  } else {
    vm.config = tableConfig;
  }

  // Default configs
  $scope.query.page = $scope.query.page || vm.config.query.page;
  $scope.query.count = $scope.query.count || vm.config.query.count;
  $scope.query.sortBy = $scope.query.sortBy || vm.config.query.sortBy;
  $scope.query.sortOrder = $scope.query.sortOrder || vm.config.query.sortOrder;

  // Set init configs
  if ($scope.reload && !vm.config.loadOnInit) {
    initNow = false;
  }
  $scope.init.count = $scope.init.count || vm.config.init.count;
  $scope.init.page = $scope.init.page || vm.config.init.page;
  $scope.init.sortBy = $scope.init.sortBy || vm.config.init.sortBy;
  $scope.init.sortOrder = $scope.init.sortOrder || vm.config.init.sortOrder;
  if (!angular.isUndefined($scope.init.filterBase)) {
    $scope.init.filterBase = $scope.init.filterBase;
  } else {
    $scope.init.filterBase = vm.config.init.filterBase;
  }  
  $scope.watchResource = $scope.watchResource || vm.config.watchResource;

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
    throw new Error('Angular tastyTable directive: need the ' +
                    'bind-resource or bind-resource-callback attribute');
  }
  if (angular.isDefined($attrs.bindResource)) {
    if (!angular.isObject($scope.resource)) {
      throw new Error('Angular tastyTable directive: the bind-resource ('+
                      $attrs.bindResource + ') is not an object');
    } else if (!$scope.resource.header && !$scope.resource.rows) {
      throw new Error('Angular tastyTable directive: the bind-resource ('+
                      $attrs.bindResource + ') has the property header or rows undefined');
    }
  }
  if (angular.isDefined($attrs.bindResourceCallback)) {
    if (!angular.isFunction($scope.resourceCallback)) {
      throw new Error('Angular tastyTable directive: the bind-resource-callback ('+
                      $attrs.bindResourceCallback + ') is not a function');
    }
    $scope.clientSide = false;
  }   

  // In TableController, by using `vm` we build an API 
  // for other directives to talk to vm one.
  vm.start = false;

  vm.activate = function(directiveName) {
    $scope[directiveName + 'Directive'] = true;
    $scope.params[directiveName] = true;
  };

  vm.setParams = function(key, value) {
    $scope.params[key] = value;
    if (['sortBy', 'sortOrder'].indexOf(key) >= 0) {
      $scope.header[key] = value;
    }
  };

  vm.initTable = function (keyDirective) {
    initStatus[keyDirective] = true;
    if (!$scope.theadDirective && !$scope.paginationDirective) { // None of them
      vm.start = true;
    } else if ($scope.theadDirective && $scope.paginationDirective) { // Both directives
      if (initStatus.thead && initStatus.pagination){
        vm.start = true;
      }
    } else if ($scope.theadDirective && !$scope.paginationDirective) { // Only Thead directive
      if (initStatus.thead){
        vm.start = true;
      }
    } else if (!$scope.theadDirective && $scope.paginationDirective) { // Only Pagination directive
      if (initStatus.pagination){
        vm.start = true;
      }
    }

    if (vm.start) {
      if ($scope.clientSide) {
        $scope.params.sortBy = $scope.resource.sortBy || $scope.init.sortBy;
        $scope.params.sortOrder = $scope.resource.sortOrder || $scope.init.sortOrder;
        $scope.params.page = $scope.init.page;
        if ($scope.resource.pagination) {
          $scope.params.page = $scope.resource.pagination.page || $scope.init.page;
        }
        if (initNow) {
          $scope.$evalAsync(updateClientSideResource);
        } 
      } else {
        $scope.params.sortBy = $scope.init.sortBy;
        $scope.params.sortOrder = $scope.init.sortOrder;
        $scope.params.page = $scope.init.page;
        if (initNow) {
          $scope.$evalAsync(updateServerSideResource);
        } else if ($scope.reload) {
          $scope.url = buildUrl($scope.params, $scope.filters);
          $scope.reload = function () {
            $scope.resourceCallback($scope.url, angular.copy($scope.params))
            .then(function (resource) {
              setDirectivesValues(resource);
            });
          };
        }
      }
    }
  };

  vm.bindOnce = vm.config.bindOnce;

  setDirectivesValues = function (resource) {
    if (!angular.isObject(resource)) {
      throw new Error('Angular tastyTable directive: the resource response '+
                      'is not an object');
    } else if (!resource.header && !resource.rows) {
      throw new Error('Angular tastyTable directive: the resource response object '+
                      'has the property header or rows undefined');
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
      if ($scope.pagination.pages < $scope.pagination.page) {
        $scope.params.page = $scope.pagination.pages;
      }
    }
  };

  buildClientResource = function(updateFrom) {
    var fromRow, toRow, rowToShow, reverse, listSortBy;
    $scope.logs.buildClientResourceCount += 1;
    if ($scope.theadDirective && $scope.header.columns.length) {
      reverse = $scope.header.sortOrder === 'asc' ? false : true;
      listSortBy = [function(item) {
        return $scope.header.sortBy.split('.')
        .reduce(function (previousValue, currentValue) {
          return previousValue[currentValue];
        }, item);
      }];
      if ($scope.header.columns[0].key !== $scope.header.sortBy) {
        listSortBy.push(function(item) {
          return $scope.header.columns[0].key.split('.')
          .reduce(function (previousValue, currentValue) {
            return previousValue[currentValue];
          }, item);
        });
      }
      if ($scope.header.sortBy) {
        $scope.rows = $filter('orderBy')($scope.rows, listSortBy, reverse);
      }
    }
    if ($attrs.bindFilters) {
      $scope.rows = $filter('filter')($scope.rows, $scope.filters, $scope.filtersComparator);
    }
    if ($scope.paginationDirective) {
      $scope.pagination.count = $scope.params.count;
      $scope.pagination.size = $scope.rows.length;
      $scope.pagination.pages = Math.ceil($scope.rows.length / $scope.pagination.count);
      if (updateFrom === 'filters' || 
          $scope.pagination.page > $scope.pagination.pages) {
        $scope.pagination.page = 1;
        $scope.params.page = 1;
      } else {
        $scope.pagination.page = $scope.params.page;
      }
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
    if ($scope.params.sortBy) {
      $scope.resource.sortBy = $scope.params.sortBy;
    }
    if ($scope.params.sortOrder) {
      $scope.resource.sortOrder = $scope.params.sortOrder;
    }
    if ($scope.params.page && $scope.params.count) {
      $scope.resource.pagination = $scope.pagination;
      $scope.resource.pagination.page = $scope.params.page;
      $scope.resource.pagination.count = $scope.params.count;
    }
    setDirectivesValues($scope.resource);
    buildClientResource(updateFrom);
  };

  updateServerSideResource = function (updateFrom) {
    if (updateFrom === 'filters') {
      if (Number.isInteger($scope.init.filterBase)) {
        if ($scope.params.page !== $scope.init.filterBase) {
          filterChangedPage = true;
        }
        $scope.params.page = $scope.init.filterBase;
      }
    }
    $scope.url = buildUrl($scope.params, $scope.filters);

    function updateServerSideResource () {
      $scope.logs.updateServerSideResourceRunning = true;
      var paramsObj = angular.copy($scope.params);
      paramsObj.filters = $scope.filters;
      $scope.resourceCallback($scope.url, paramsObj)
      .then(function (resource) {
        setDirectivesValues(resource);
        $scope.logs.updateServerSideResourceRunning = false;
      });
    }

    if ($scope.reload) {
      $scope.reload = updateServerSideResource;
    }
    if ((initNow || updateFrom === 'params') &&
        !$scope.logs.updateServerSideResourceRunning) {

      if ($scope.reload) {
        if (!filterChangedPage) {
          updateServerSideResource();
        }
      } else {
        updateServerSideResource();
        filterChangedPage = false;
      }
    }
  };
  
  // AngularJs $watch callbacks
  if ($attrs.bindFilters) {
    $scope.$watch('filters', function watchFilters (newValue, oldValue){
      if (newValue !== oldValue) {
        if ($scope.clientSide) {
          $scope.$evalAsync(updateClientSideResource('filters'));
        } else {
          $scope.$evalAsync(updateServerSideResource('filters'));
        }
      }
    }, true);
  }
  $scope.$watchCollection('params', function watchParams (newValue, oldValue){
    if (newValue !== oldValue) {
      // Run update resuorce only if we are on 
      // the second cycle or more of `params`
      if (paramsInitialCycle === false) {
        if ($scope.clientSide) {
          $scope.$evalAsync(updateClientSideResource('params'));
        } else {
          $scope.$evalAsync(updateServerSideResource('params'));
        }
      } else {
        paramsInitialCycle = false;
      }
    }
  });
  if ($scope.resource) {
    var watchResource = function (newValue, oldValue){
      if (newValue !== oldValue) {
        $scope.params.sortBy = $scope.resource.sortBy || $scope.params.sortBy;
        $scope.params.sortOrder = $scope.resource.sortOrder || $scope.params.sortOrder;
        $scope.$evalAsync(updateClientSideResource('resource'));
        if (!$scope.resource.reload) {
          $scope.resource.reload = function reloadResource () {
            $scope.$evalAsync(updateClientSideResource('resource'));
          };
        }
      }
    };
    if ($scope.watchResource === 'reference') {
      $scope.$watch('resource', watchResource);
    } else if ($scope.watchResource === 'collection') {
      $scope.$watchCollection('resource.header', watchResource);
      $scope.$watchCollection('resource.rows', watchResource);
      $scope.$watchGroup(['resource.sortBy', 
        'resource.sortOrder', 
        'resource.pagination.count',
        'resource.pagination.page',
        'resource.pagination.pages',
        'resource.pagination.size'], watchResource);
    } else if ($scope.watchResource === 'equality') {
      $scope.$watch('resource.header', watchResource, true);
      $scope.$watch('resource.rows', watchResource, true);
      $scope.$watch('resource.sortBy', watchResource, true);
      $scope.$watch('resource.sortOrder', watchResource, true);
      $scope.$watch('resource.pagination.count', watchResource, true);
      $scope.$watch('resource.pagination.page', watchResource, true);
      $scope.$watch('resource.pagination.pages', watchResource, true);
      $scope.$watch('resource.pagination.size', watchResource, true);
    }
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
 * @name ngTasty.component.tastyThead
 *
 * @example
  <table tasty-table>
    <thead table-head></thead>
    <tbody></tbody>
  </table>
 *
 */
.directive('tastyThead', function($filter, $templateCache, $http, $compile, tableConfig, tastyUtil) {
  return {
    restrict: 'AE',
    require: '^tastyTable',
    scope: {},
    templateUrl: tableConfig.templateHeadUrl,
    link: function postLink(scope, element, attrs, tastyTable) {
      var newScopeName, listScopeToWatch;
      scope.bindOnce = tastyTable.bindOnce;
      scope.columns = [];
      scope.bootstrapIcon = tastyTable.config.bootstrapIcon;
      scope.iconUp = tastyTable.config.iconUp;
      scope.iconDown = tastyTable.config.iconDown;

      listScopeToWatch = [
        'bindNotSortBy', 
        'bindBootstrapIcon', 
        'bindIconUp', 
        'bindIconDown',
        'bindTemplateUrl'
      ];
      listScopeToWatch.forEach(function (scopeName) {
        newScopeName = scopeName.substring(4);
        newScopeName = newScopeName.charAt(0).toLowerCase() + newScopeName.slice(1);
        if (attrs[scopeName]) {
          tastyUtil.bindTo(scopeName, scope, attrs, newScopeName);
        } else if (attrs[newScopeName]) {
          if (attrs[newScopeName][0] === '[') {
            attrs[newScopeName] = attrs[newScopeName].replace(/'/g, '"');
            scope[newScopeName] = JSON.parse(attrs[newScopeName]);
          } else {
            scope[newScopeName] = attrs[newScopeName];
          }
        }
      });

      if (scope.templateUrl) {
        $http.get(scope.templateUrl, { cache: $templateCache })
        .success(function(templateContent) {
          element.replaceWith($compile(templateContent)(scope));                
        });
      }

      function cleanSortBy (sortBy) {
        if (sortBy) {
          return $filter('cleanFieldName')(sortBy);
        }
        return undefined;
      }

      scope.setColumns = function () {
        var width, i, active, sortable, sort, 
            isSorted, isSortedCaret;
        scope.columns = [];
        if (scope.header.sortOrder === 'dsc' && 
            scope.header.sortBy &&
            scope.header.sortBy[0] !== '-') {
          scope.header.sortBy = '-' + scope.header.sortBy;
        }
        scope.header.columns.forEach(function (column, index) {
          column.style = column.style || {};
          if (!angular.isArray(column.class)) {
            column.class = [];
          }
          sortable = true;
          active = false;
          isSorted = '';
          isSortedCaret = '';
          // Not sort column when the key is present in the `notSortBy` list,
          // and Not sort column when `notSortBy` is an empty list
          // If sortable property is present in column object, then use it
          if (angular.isArray(scope.notSortBy)) {
            if (scope.notSortBy.length) {
              sortable = scope.notSortBy.indexOf(column.key) < 0;
            } else {
              sortable = false;
            }
          } else {
            if (angular.isDefined(column.sortable)) {
              sortable = column.sortable === true;
            }
          }
          if (column.key === scope.header.sortBy ||
              '-' + column.key === scope.header.sortBy) {
            active = true;
          }
          if (!angular.isDefined(column.key)) {
            throw new Error('Angular tastyTable directive: need a key value ' +
                            'each column table header');
          }
          sort = $filter('cleanFieldName')(column.key);
          if (cleanSortBy(scope.header.sortBy) === '-' + sort) {
            if (tastyTable.config.bootstrapIcon) {
              isSorted = '';
              isSortedCaret = 'caret';
            } else {
              isSorted = scope.iconDown;
            }
          } else if (cleanSortBy(scope.header.sortBy) === sort) {
            if (tastyTable.config.bootstrapIcon) {
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
            'class': column.class,
            'style': column.style,
            'isSorted': isSorted,
            'isSortedCaret': isSortedCaret
          });
        });
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
        if (cleanSortBy(scope.header.sortBy) === columnName) {
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
        column.class.forEach(function getListClass (className) {
          listClassToShow.push(className);
        });
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
 * @name ngTasty.component.tastyPagination
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
    templateUrl: tableConfig.templateUrl,
    link: function postLink(scope, element, attrs, tastyTable) {
      var getPage, setCount, setPaginationRange, setPreviousRange, 
          setRemainingRange, setPaginationRanges, listScopeToWatch, newScopeName;

      listScopeToWatch = [
        'bindItemsPerPage', 
        'bindListItemsPerPage', 
        'bindTemplateUrl'
      ];
      listScopeToWatch.forEach(function (scopeName) {
        newScopeName = scopeName.substring(4);
        newScopeName = newScopeName.charAt(0).toLowerCase() + newScopeName.slice(1);
        if (attrs[scopeName]) {
          tastyUtil.bindTo(scopeName, scope, attrs, newScopeName);
        } else if (attrs[newScopeName]) {
          if (newScopeName === 'itemsPerPage') {
            scope[newScopeName] = parseInt(attrs[newScopeName]);
          } else {
            try {
              scope[newScopeName] = JSON.parse(attrs[newScopeName]);
            } catch (err) {
              scope[newScopeName] = attrs[newScopeName];
            }
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
      scope.itemsPerPage = scope.itemsPerPage || tastyTable.config.itemsPerPage;
      scope.listItemsPerPage = scope.listItemsPerPage || tastyTable.config.listItemsPerPage;

      // Serve side table case
      if (!tastyTable.$scope.clientSide) {
        scope.itemsPerPage = tastyTable.$scope.init.count || scope.itemsPerPage;
      }

      // Internal variable
      scope.pagination = {};
      scope.pagMinRange = 1;
      scope.pagMaxRange = 1;

      getPage = function (numPage) {
        tastyTable.setParams('page', numPage);
      };

      setCount = function(count) {
        var maxItems, page;
        scope.itemsPerPage = count;
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
        scope.pagMinRange = scope.pagMaxRange - 5;
        setPaginationRanges();
      };

      setRemainingRange = function () {
        if (scope.pagHideMaxRange === true || 
            scope.pagMaxRange > scope.pagination.pages) {
          return false;
        }
        scope.pagMinRange = scope.pagMaxRange;
        scope.pagMaxRange = scope.pagMinRange + 5;
        if (scope.pagMaxRange >= scope.pagination.pages) {
          scope.pagMaxRange = scope.pagination.pages + 1;
          scope.pagMinRange = scope.pagMaxRange - 5 + 1;
        }
        scope.pagMinRange = scope.pagMaxRange - 5;
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
        scope.pagHideMaxRange = scope.pagMaxRange > scope.pagination.pages;
        scope.classPageMinRange = scope.pagHideMinRange ? 'disabled' : '';
        scope.classPageMaxRange = scope.pagHideMaxRange ? 'disabled' : '';

        for (var i = scope.listItemsPerPage.length; i >= 0; i--) {
          if (scope.pagination.size > scope.listItemsPerPage[i]) {
            scope.listItemsPerPageShow = scope.listItemsPerPage.slice(0, (i + 2));
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
