var app = angular.module('eventDelegationBenchmark', ['ngTasty']);

app.controller('DataController', function($rootScope, $scope) {
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
  $scope.itemsPerPage = 10;
  $scope.listItemsPerPage = [10, 25, 50, 100]; 

  benchmarkSteps.push({
    name: 'destroy',
    description: 'Set rows to empty array',
    fn: function() {
      $scope.$apply(function() {
        $scope.resource.rows = [];
      });
    }
  });

  benchmarkSteps.push({
    name: 'setup',
    description: 'Push new rows to be applied in next step',
    fn: function() {
      for (var i = 0; i < 4000; i++) {
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
    }
  });

  benchmarkSteps.push({
    name: '$apply',
    fn: function() {
      $rootScope.$apply();
    }
  });
});