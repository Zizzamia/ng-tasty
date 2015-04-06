angular.module('myApp.pages.debounce', [])
.controller('DebounceCtrl', function($rootScope, $scope, $timeout, debounce) {
  $rootScope.page = 'debounce';
  $rootScope.fullContent = false;
  
  $scope.number = 1;
  $scope.plusOne = debounce(function () {
    $scope.number += 1;
  }, 1000);
  $timeout(function () {
    Rainbow.color();
  });
})
