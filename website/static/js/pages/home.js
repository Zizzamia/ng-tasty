angular.module('myApp.pages.home', [])
.controller('HomeCtrl', function($rootScope, $scope, $timeout) {
  $rootScope.page = 'home';
  $rootScope.fullContent = false;
  
  $timeout(function () {
    Rainbow.color();
  });
})
