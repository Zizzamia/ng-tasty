angular.module('myApp', [
  'ngTasty.table',
  'myApp.controllers',
  'ui.bootstrap'
]);
angular.module('myApp.controllers', [])
.config(function($httpProvider){
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
})
.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {

  $scope.countTest = 1;

  $scope.filterBy = {
    'time': 'now'
  };

  $scope.filterByThree = {
    'time': 'now'
  };

  $scope.open = function(toOpen) {
    $scope.table = true;
    $scope.tableOne = true;
    $scope.tableTwo = true;
    $scope.tableThree = true;
    if (toOpen === 'complete') {
      $scope.table = false;
    } else if (toOpen === 'sorting') {
      $scope.tableOne = false;
    } else if (toOpen === 'pagination') {
      $scope.tableTwo = false;
    } else {
      $scope.tableThree = false;
    }
  }
  $scope.open('complete');

  $scope.getResource = function (params) {
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
      }
    });
  }

  $scope.getResourceOne = function (params) {
    $scope.urlApiOne = 'table.json?' + params;
    return $http.get($scope.urlApiOne).then(function (response) {
      $scope.responseTwo = JSON.stringify(response.data, undefined, 2);
      $scope.countTest += 1;
      return {
        'rows': response.data.rows,
        'header': response.data.header,
        'sortBy': response.data['sort-by'],
        'sortOrder': response.data['sort-order']
      }
    });
  }

  $scope.getResourceTwo = function (params) {
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
      }
    });
  }

  $scope.getResourceThree = function (params) {
    $scope.urlApiThree = 'table.json?' + params;
    return $http.get($scope.urlApiThree).then(function (response) {
      $scope.responseFour = JSON.stringify(response.data, undefined, 2);
      $scope.countTest += 1;
      return {
        'rows': response.data.rows,
        'header': response.data.header
      }
    });
  }
}]);