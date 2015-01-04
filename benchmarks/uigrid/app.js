var app = angular.module('eventDelegationBenchmark', ['ngTouch', 'ui.grid', 'ui.grid.pagination']);

app.config(function($compileProvider) {
  if ($compileProvider.debugInfoEnabled) {
    $compileProvider.debugInfoEnabled(false);
  }
});

app.controller('DataController', function($rootScope, $scope) {
  $scope.end = 5000;
  $scope.resource = {
    paginationPageSizes: [10, 25, 50, 100],
    paginationPageSize: 10,
    columnDefs: [
      { name: 'name' },
      { name: 'star' },
      { name: 'sf-location' }
    ],
    data: []
  };
  for (var i = 1000; i < $scope.end; i++) {
    $scope.resource.data.push({ 
      "name": "Ritual Coffee Roasters " + i, 
      "star": "★★★★★  " + i, 
      "sf-location": "Hayes Valley " + i,
      "name2": "Ritual Coffee Roasters " + i, 
      "star2": "★★★★★  " + i, 
      "sf-location2": "Hayes Valley " + i,
      "name3": "Ritual Coffee Roasters " + i, 
      "star3": "★★★★★  " + i, 
      "sf-location3": "Hayes Valley " + i,
      "name4": "Ritual Coffee Roasters " + i 
    });
  }

  var previousType;

  benchmarkSteps.push({
    name: 'destroy',
    fn: function() {
      $scope.$apply(function() {
        previousType = $scope.benchmarkType;
        $scope.benchmarkType = 'none';
      });
    }
  });

  benchmarkSteps.push({
    name: 'create',
    fn: function() {
      $scope.$apply(function() {
        for (var i = $scope.resource.data.length; i < $scope.end; i++) {
          $scope.resource.data.push({ 
            "name": "Ritual Coffee Roasters " + i, 
            "star": "★★★★★  " + i, 
            "sf-location": "Hayes Valley " + i,
            "name2": "Ritual Coffee Roasters " + i, 
            "star2": "★★★★★  " + i, 
            "sf-location2": "Hayes Valley " + i,
            "name3": "Ritual Coffee Roasters " + i, 
            "star3": "★★★★★  " + i, 
            "sf-location3": "Hayes Valley " + i,
            "name4": "Ritual Coffee Roasters " + i 
          });
        }
        $scope.benchmarkType = previousType;
      });
    }
  });

  benchmarkSteps.push({
    name: '$apply',
    fn: function() {
      $scope.end += 2;
      $rootScope.$apply();
    }
  });
});