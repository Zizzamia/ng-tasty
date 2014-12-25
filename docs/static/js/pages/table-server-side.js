angular.module('myApp.pages.tableServerSide', [])
.controller('TableServerSideCtrl', function($rootScope, $scope, $http, $timeout) {

  $rootScope.page = 'table-server-side';
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
  $scope.filterByThree = {
    'name': 'ro',
    'sf-location': 'ha'
  };
  $scope.templateUrl = 'template/table/pagination.html';

  $scope.open = function(toOpen) {
    $scope.table = true;
    $scope.tableTwo = true;
    $scope.tableThree = true;
    $scope.tableFour = true;
    if (toOpen === 'complete') {
      $scope.table = false;
    } else if (toOpen === 'sorting') {
      $scope.tableTwo = false;
    } else if (toOpen === 'pagination') {
      $scope.tableThree = false;
    } else if (toOpen === 'filtering') {
      $scope.tableFour = false;
    }
  };
  $scope.open('complete');

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
