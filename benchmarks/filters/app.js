var app = angular.module('eventDelegationBenchmark', ['ngTasty']);

app.controller('DataController', function($rootScope, $scope) {
  this.ngRepeatCount = 10000;
  var self = this;
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
    "rows": [{ 
     "name": "Ritual Coffee Roasters", 
     "star": "★★★★★", 
     "sf-location": "Hayes Valley"
   }]
  };

  benchmarkSteps.push({
    name: '$apply',
    fn: function() {
      $rootScope.$apply(function() {
        $scope.resource.rows = [];
      });
      if ($scope.resource.rows.length !== self.ngRepeatCount) {
        $scope.resource.rows = [];
        for (var i = 0; i < self.ngRepeatCount; i++) {
          $scope.resource.rows.push({ 
            "name": "Ritual Coffee Roasters " + i, 
            "star": "★★★★★  " + i, 
            "sf-location": "Hayes Valley " + i
          });
        }
      }
      $rootScope.$apply();
    }
  });
});