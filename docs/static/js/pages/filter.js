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
.controller('CamelizeCtrl', function($rootScope, $scope, $http, $timeout) {

  $rootScope.page = 'camelize';

  $scope.txt1 = 'hey_there';
  $scope.txt2 = 'look-at-this';
  $scope.txt3 = 'this_is_awesome';

  $timeout(function () {
    Rainbow.color();
  });
})
.controller('SlugifyCtrl', function($rootScope, $scope, $http, $timeout) {

  $rootScope.page = 'slugify';

  $scope.txt1 = 'some text here';
  $scope.txt2 = 'Some Text hERe';
  $scope.txt3 = 'some #%% text ][] here )(*';
  $scope.txt4 = 's#@ome[] [#te!xt %$h#ere';
  $scope.txt5 = 'šõmé @##@țëxť -hêre';

  $timeout(function () {
    Rainbow.color();
  });
})
