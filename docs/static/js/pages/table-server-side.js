angular.module('myApp.pages.tableServerSide', [])
.controller('TableServerSideCompleteCtrl', function($rootScope, $scope, $http, $timeout) {
  $rootScope.page = 'table-server-side';
  $rootScope.innerPage = 'complete';
  
  $scope.init = {
    'count': 5,
    'page': 1,
    'sortBy': 'name',
    'sortOrder': 'dsc'
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
      $scope.countTest += 1;
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
      $scope.countTest += 1;
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
      $scope.countTest += 1;
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
      $scope.countTest += 1;
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
.controller('TableServerSideInitCtrl', function($rootScope, $scope, $http, $timeout) {
  $rootScope.page = 'table-server-side';
  $rootScope.innerPage = 'init';
  
  $scope.init = false;
  $scope.reloadCallback = function () {};

  $scope.filterBy = {
    'name': '',
    'sf-location': ''
  };

  $scope.search = function () {
    $scope.reloadCallback();
  };

  $scope.getResourceInit = function (params, paramsObj) {
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
