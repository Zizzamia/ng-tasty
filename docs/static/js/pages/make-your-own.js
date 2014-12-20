angular.module('myApp.pages.makeYourOwn', [])
.controller('MakeYourOwnCtrl', function($rootScope, $scope, $http, $timeout) {
  $rootScope.page = 'MakeYourOwn';
  $scope.component = {
    'table': true
  };
  $scope.service = {
    'debounce': true
  };
  $scope.filter = {
    'range': true
  };

  $scope.compile = function () {
    var modules = [];
    if ($scope.component.table) {
      modules.push('ngTasty.component.table');
    }
    if ($scope.service.debounce) {
      modules.push('ngTasty.service.debounce');
    }
    if ($scope.filter.range) {
      modules.push('ngTasty.filter.range');
    }
    $http.post('compile.json', modules).then(function (response) {
      if (response.data.success) {
        window.location.href = 'dist/releases/ng-tasty.zip';
      }
    });
  };
})
