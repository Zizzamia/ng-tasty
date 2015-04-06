angular.module('myApp.pages.contribute', [])
.controller('ContributeCtrl', function($rootScope, $scope, $timeout) {
  $rootScope.page = 'contribute';
  $rootScope.fullContent = false;
  
  $timeout(function () {
    Rainbow.color();
  });
})
