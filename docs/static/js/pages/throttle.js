angular.module('myApp.pages.throttle', [])
.controller('ThrottleCtrl', function($rootScope, $scope, $timeout, throttle) {
  $rootScope.page = 'throttle';
  $rootScope.fullContent = false;
  
  $scope.number = 1;
  $scope.plusOne = throttle(function () {
    $scope.number += 1;
  }, 1000);
  $timeout(function () {
    Rainbow.color();
  });
})
