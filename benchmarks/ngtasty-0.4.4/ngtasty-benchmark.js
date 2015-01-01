var app = angular.module('eventDelegationBenchmark', ['ngTasty']);

app.config(function($compileProvider) {
  if ($compileProvider.debugInfoEnabled) {
    $compileProvider.debugInfoEnabled(false);
  }
});

app.controller('DataController', function($rootScope, $scope) {
  $scope.end = 5000;
  $scope.resource = {
    "header": [
      { "name": "Name" },
      { "star": "star" },
      { "sf-location": "SF Location" }
    ],
    "rows": []
  };
  for (var i = 1000; i < $scope.end; i++) {
    $scope.resource.rows.push({ 
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
  $scope.itemsPerPage = 10;
  $scope.listItemsPerPage = [10, 25, 50, 100]; 

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
        for (var i = $scope.resource.rows.length; i < $scope.end; i++) {
          $scope.resource.rows.push({ 
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