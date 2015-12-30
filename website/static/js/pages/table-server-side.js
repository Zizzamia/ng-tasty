angular.module('myApp.pages.tableServerSide', [])
.controller('TableServerSideSimpleCtrl', function($rootScope, $scope, $http, $timeout) {
  $rootScope.page = 'table-server-side';
  $rootScope.innerPage = 'simple';

  $scope.getResource = function (params, paramsObj) {
    $scope.params = params;
    $scope.paramsObj = paramsObj;
    $scope.urlApi = 'table.json?' + params;
    return $http.get($scope.urlApi).then(function (response) {
      $scope.response = JSON.stringify(response.data, undefined, 2);
      return {
        'rows': response.data.rows,
        'header': response.data.header,
        'pagination': response.data.pagination,
        'sortBy': response.data['sort-by'],
        'sortOrder': response.data['sort-order']
      };
    });
  };
  $timeout(function () {
    Rainbow.color();
  });
})
.controller('TableServerSideCompleteCtrl', function($rootScope, $scope, $http, $timeout) {
  $rootScope.page = 'table-server-side';
  $rootScope.innerPage = 'complete';
  
  $scope.init = {
    'count': 5,
    'page': 1,
    'sortBy': 'name',
    'sortOrder': 'dsc',
    'filterBase': 1
  };

  $scope.filterBy = {
    'name': 'r',
    'sf-location': ''
  };
  $scope.getResource = function (params, paramsObj) {
    $scope.params = params;
    $scope.paramsObj = paramsObj;
    $scope.urlApi = 'table.json?' + params;
    return $http.get($scope.urlApi).then(function (response) {
      $scope.response = JSON.stringify(response.data, undefined, 2);
      return {
        'rows': response.data.rows,
        'header': response.data.header,
        'pagination': response.data.pagination,
        'sortBy': response.data['sort-by'],
        'sortOrder': response.data['sort-order']
      };
    });
  };

  $timeout(function () {
    Rainbow.color();
  });
})
.controller('TableServerSideSortingCtrl', function($rootScope, $scope, $http, $timeout) {
  $rootScope.page = 'table-server-side';
  $rootScope.innerPage = 'sorting';

  $scope.notSortBy = ['sf-location'];
  $scope.getResourceOne = function (params, paramsObj) {
    $scope.paramsOne = params;
    $scope.paramsObjOne = paramsObj;
    $scope.urlApiOne = 'table.json?' + params;
    return $http.get($scope.urlApiOne).then(function (response) {
      $scope.responseTwo = JSON.stringify(response.data, undefined, 2);
      return {
        'rows': response.data.rows,
        'header': response.data.header,
        'sortBy': response.data['sort-by'],
        'sortOrder': response.data['sort-order']
      };
    });
  };
  $timeout(function () {
    Rainbow.color();
  });
})
.controller('TableServerSidePaginationCtrl', function($rootScope, $scope, $http, $timeout) {
  $rootScope.page = 'table-server-side';
  $rootScope.innerPage = 'pagination';

  $scope.init = {
    'count': 5,
    'page': 1,
    'sortBy': 'name',
    'sortOrder': 'dsc'
  };

  $scope.templateUrl = 'template/table/pagination.html';
  $scope.getResourceTwo = function (params, paramsObj) {
    $scope.paramsTwo = params;
    $scope.paramsObjTwo = paramsObj;
    $scope.urlApiTwo = 'table.json?' + params;
    return $http.get($scope.urlApiTwo).then(function (response) {
      $scope.responseThree = JSON.stringify(response.data, undefined, 2);
      return {
        'rows': response.data.rows,
        'header': response.data.header,
        'pagination': response.data.pagination,
        'sortBy': response.data['sort-by'],
        'sortOrder': response.data['sort-order']
      };
    });
  };
  $timeout(function () {
    Rainbow.color();
  });
})
.controller('TableServerSideFiltersCtrl', function($rootScope, $scope, $http, $timeout) {
  $rootScope.page = 'table-server-side';
  $rootScope.innerPage = 'filters';

  $scope.filterByThree = {
    'name': 'ro',
    'sf-location': 'ha'
  };

  $scope.getResourceThree = function (params, paramsObj) {
    $scope.paramsThree = params;
    $scope.paramsObjThree = paramsObj;
    $scope.urlApiThree = 'table.json?' + params;
    return $http.get($scope.urlApiThree).then(function (response) {
      $scope.responseFour = JSON.stringify(response.data, undefined, 2);
      return {
        'rows': response.data.rows,
        'header': response.data.header
      };
    });
  };
  $timeout(function () {
    Rainbow.color();
  });
})
.controller('TableServerSideReloadCtrl', function($rootScope, $scope, $http, $timeout, $interval) {
  $rootScope.page = 'table-server-side';
  $rootScope.innerPage = 'reload';
  
  $scope.init = {
    'count': 5,
    'page': 1,
    'sortBy': 'name',
    'sortOrder': 'dsc',
    'bindOnce': false
  };

  $scope.reloadCallback = function () {};

  $scope.filterBy = {
    'name': '',
    'sf-location': ''
  };

  $scope.search = function () {
    $scope.reloadCallback();
  };
  $scope.timeLeft = 60;

  $scope.getResourceReload = function (params, paramsObj) {
    $scope.params = params;
    $scope.paramsObj = paramsObj;
    $scope.urlApi = 'table-tmp.json?' + params;
    return $http.get($scope.urlApi).then(function (response) {
      $scope.response = JSON.stringify(response.data, undefined, 2);
      var header = response.data.header;
      header.push({
        'key': 'remove',
        'name': 'Remove',
        'sortable': false
      });
      $scope.timeLeft = response.data.timeLeft;
      return {
        'rows': response.data.rows,
        'header': header,
        'pagination': response.data.pagination,
        'sortBy': response.data['sort-by'],
        'sortOrder': response.data['sort-order']
      };
    });
  };

  $scope.removeItem = function (item) {
    $http.post('table-delete-row.json', {
      'name': item.name,
      'sf-location': item.sfLocatin
    }).then(function (response) {
      $scope.reloadCallback();
    })
  };

  $interval(function () {
    if ($scope.timeLeft > 0) {
      $scope.timeLeft -= 1;
    }
  }, 1000);

  $timeout(function () {
    Rainbow.color();
  });
})
.controller('TableServerSideCustomThemeCtrl', function($rootScope, $scope, $http, $timeout) {
  $rootScope.page = 'table-server-side';
  $rootScope.innerPage = 'custom-theme';

  $scope.init = {
    'count': 20,
    'page': 1,
    'sortBy': 'name',
    'sortOrder': 'dsc'
  };
  $scope.filterBy = {
    'name': '',
    'sf-location': ''
  };
  $scope.customTheme = {
    iconUp: 'fa fa-chevron-circle-up',
    iconDown: 'fa fa-chevron-circle-down',
    listItemsPerPage: [5, 10, 20, 30],
    itemsPerPage: 10,
    loadOnInit: true
  };

  $scope.getResource = function (params, paramsObj) {
    $scope.params = params;
    $scope.paramsObj = paramsObj;
    $scope.urlApi = 'table.json?' + params;
    return $http.get($scope.urlApi).then(function (response) {
      $scope.response = JSON.stringify(response.data, undefined, 2);
      return {
        'rows': response.data.rows,
        'header': response.data.header,
        'pagination': response.data.pagination,
        'sortBy': response.data['sort-by'],
        'sortOrder': response.data['sort-order']
      };
    });
  };
  $timeout(function () {
    Rainbow.color();
  });
});
