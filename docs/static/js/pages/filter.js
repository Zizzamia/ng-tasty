angular.module('myApp.pages.filter', [])
.controller('FilterCtrl', function($rootScope, $scope, $http, $timeout) {

  $rootScope.page = 'range';

  $scope.age = 27;
  $scope.text = 'Ciao';
  $scope.ageBytext = '22';

  $scope.start = 1;
  $scope.stop = 10;
  $scope.step = 2;

  $timeout(function () {
    Rainbow.color();
  });
})
