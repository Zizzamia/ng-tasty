var app = angular.module('eventDelegationBenchmark', ['ngTable']);

app.config(function($compileProvider) {
  if ($compileProvider.debugInfoEnabled) {
    $compileProvider.debugInfoEnabled(false);
  }
});

app.controller('DataController', function($rootScope, $scope, $filter, ngTableParams) {
  $scope.end = 5000;
  $scope.resource = {
    "header": [
      {
        "key": "name", 
        "name": "Name"
      },
      {
        "key": "star", 
        "name": "star"
      },
      {
        "key": "sf-location", 
        "name": "SF Location"
      }
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
        $scope.tableParams = new ngTableParams({
          page: 1,            // show first page
          count: 10,          // count per page
          sorting: {
            name: 'asc'     // initial sorting
          }
        }, {
          total: $scope.resource.rows.length, // length of data
          getData: function($defer, params) {
            // use build-in angular filter
            var orderedData = params.sorting() ?
                              $filter('orderBy')($scope.resource.rows, params.orderBy()) :
                              $scope.resource.rows;
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), 
                                              params.page() * params.count()));
          }
        });
        $scope.tableParams.settings().$scope = $scope;
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