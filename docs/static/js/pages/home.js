angular.module('myApp.pages.home', [])
.controller('HomeCtrl', function($rootScope, $scope, $timeout) {
  $rootScope.page = 'home';
  $timeout(function () {
    Rainbow.color();
  });
})
