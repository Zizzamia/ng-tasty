angular.module('myApp.pages.filter', [])
.controller('RangeCtrl', function($rootScope, $scope, $http, $timeout) {

  $rootScope.page = 'range';

  $scope.start = 1;
  $scope.stop = 10;
  $scope.step = 2;

  $timeout(function () {
    Rainbow.color();
  });
})
.controller('FilterCtrl', function($rootScope, $scope, $http, $timeout) {

  $rootScope.page = 'filter-int';

  $scope.age = 27;
  $scope.text = 'Ciao';
  $scope.ageBytext = '22';

  $timeout(function () {
    Rainbow.color();
  });
})
