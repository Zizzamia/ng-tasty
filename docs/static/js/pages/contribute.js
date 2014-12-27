angular.module('myApp.pages.contribute', [])
.controller('ContributeCtrl', function($rootScope, $scope, $timeout) {
  $rootScope.page = 'contribute';
  $timeout(function () {
    Rainbow.color();
  });
})
