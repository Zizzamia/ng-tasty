angular.module('myApp', [
  'ngTasty',
  'ui.bootstrap',
  'myApp.controllers'
]);
angular.module('myApp.controllers', [])
.controller('AppCtrl', ['$scope', '$modal', function($scope, $modal) {
  $scope.showDownloadModal = function() {
    var modalInstance = $modal.open({
      templateUrl: 'downloadModal.html',
      controller: 'DownloadCtrl'
    });
  };
}])
.controller('DownloadCtrl', ['$scope', '$modalInstance', function($scope, $modalInstance) {
  $scope.options = {
    version: '0.2.6',
    minified: true,
    tpls: true
  };

  $scope.download = function (version) {
    var options = $scope.options;
    var baseUrl = 'https://raw.githubusercontent.com/Zizzamia/bower-ng-tasty';
    var downloadUrl = [baseUrl + '/v' + options.version + '/ng-tasty'];
    if (options.tpls) {
      downloadUrl.push('-tpls');
    }
    if (options.minified) {
      downloadUrl.push('.min');
    }
    downloadUrl.push('.js');
    return downloadUrl.join('');
  };

  $scope.cancel = function () {
    $modalInstance.dismiss();
  };
}])
.controller('TableCtrl', ['$scope', '$http', function($scope, $http) {
  $scope.open = function(toOpen) {
    $scope.table = true;
    $scope.tableTwo = true;
    $scope.tableThree = true;
    if (toOpen === 'complete') {
      $scope.table = false;
    } else if (toOpen === 'sorting') {
      $scope.tableTwo = false;
    } else if (toOpen === 'pagination') {
      $scope.tableThree = false;
    }
  }
  $scope.open('complete');
  $scope.resource = {
    "header": [
      {
        "key": "name", 
        "name": "Name"
      },
      {
        "key": "star", 
        "name": "Star"
      },
      {
        "key": "sf-location", 
        "name": "SF Location"
      }
    ],
    "rows": [
      { "name": "Ritual Coffee Roasters", "star": "★★★★★", "sf-location": "Hayes Valley"},
      { "name": "Blue Bottle", "star": "★★★★★", "sf-location": "Hayes Valley" },
      { "name": "CoffeeShop", "star": "★★★", "sf-location": "Bernal Heights" },
      { "name": "Spike's Coffee & Teas", "star": "★★★", "sf-location": "Castro" },
      { "name": "La Boulange", "star": "★★", "sf-location": "Cole Valley" },
      { "name": "Dynamo Donut and Coffee", "star": "★★★★★", "sf-location": "Cow Hollow" },
      { "name": "The Mill", "star": "★★★★", "sf-location": "Divisadero" },
      { "name": "Piccino Coffee Bar", "star": "★★★", "sf-location": "Dogpatch" },
      { "name": "Philz", "star": "★★★", "sf-location": "Downtown" },
      { "name": "Duboce Park Cafe", "star": "★★", "sf-location": "Duboce Triangle" },
      { "name": "Blue Bottle", "star": "★★★★★", "sf-location": "Embarcadero" },
      { "name": "Four Barrel", "star": "★★★", "sf-location": "Excelsior" },
      { "name": "Coffee Bar", "star": "★★★★★", "sf-location": "FiDi" },
      { "name": "Biscoff Coffee Corner", "star": "★★★", "sf-location": "Fisherman’s Wharf" },
      { "name": "Fifty/Fifty Coffee and Tea", "star": "★★★", "sf-location": "Inner Richmond" },
      { "name": "Beanery", "star": "★★★", "sf-location": "Inner Sunset" },
      { "name": "Cafe du Soleil", "star": "★★", "sf-location": "Lower Haight" },
      { "name": "Peet's", "star": "★", "sf-location": "The Marina" },
      { "name": "Sightglass", "star": "★★★★", "sf-location": "The Mission" },
      { "name": "Contraband Coffee Bar", "star": "★★★★", "sf-location": "Nob Hill" },
      { "name": "Martha & Bros Coffee", "star": "★★★", "sf-location": "Noe Valley" },
      { "name": "Réveille", "star": "★★★", "sf-location": "North Beach" },
      { "name": "Cup Coffee Bar", "star": "★★★", "sf-location": "Outer Mission" },
      { "name": "Garden House Cafe", "star": "★★★", "sf-location": "Outer Richmond" },
      { "name": "Andytown Coffee Roasters", "star": "★★★", "sf-location": "Outer Sunset" },
      { "name": "Jane on Fillmore", "star": "★★", "sf-location": "Pacific Heights" },
      { "name": "Saint Frank Coffee", "star": "★★★", "sf-location": "Polk" },
      { "name": "Farley’s", "star": "★★★", "sf-location": "Potrero Hill" },
      { "name": "House of Snacks", "star": "★★★", "sf-location": "The Presidio" },
      { "name": "The Brew", "star": "★★★", "sf-location": "Russian Hill" },
      { "name": "Wicked Grounds", "star": "★★★", "sf-location": "SOMA" },
      { "name": "Starbucks", "star": "★", "sf-location": "Union Square" },
      { "name": "Flywheel Coffee Roasters", "star": "★★★★★", "sf-location": "Upper Haight" }
    ]
  };
  $scope.notSortBy = ['sf-location'];

  $scope.itemsPerPage = 10;
  $scope.listItemsPerPage = [10, 20, 40, 80];  
}])
.controller('TableServerSideCtrl', ['$scope', '$http', function($scope, $http) {
  
  $scope.filterBy = {
    'time': 'now'
  };
  
  $scope.filterByThree = {
    'time': 'now'
  };

  $scope.open = function(toOpen) {
    $scope.table = true;
    $scope.tableTwo = true;
    $scope.tableThree = true;
    $scope.tableFour = true;
    if (toOpen === 'complete') {
      $scope.table = false;
    } else if (toOpen === 'sorting') {
      $scope.tableTwo = false;
    } else if (toOpen === 'pagination') {
      $scope.tableThree = false;
    } else if (toOpen === 'filtering') {
      $scope.tableFour = false;
    }
  }
  $scope.open('complete');

  $scope.getResource = function (params) {
    $scope.urlApi = 'table.json?' + params;
    return $http.get($scope.urlApi).then(function (response) {
      $scope.response = JSON.stringify(response.data, undefined, 2);
      $scope.countTest += 1;
      return {
        'rows': response.data.rows,
        'header': response.data.header,
        'pagination': response.data.pagination,
        'sortBy': response.data['sort-by'],
        'sortOrder': response.data['sort-order']
      }
    });
  }

  $scope.notSortBy = ['sf-location'];
  $scope.getResourceOne = function (params) {
    $scope.urlApiOne = 'table.json?' + params;
    return $http.get($scope.urlApiOne).then(function (response) {
      $scope.responseTwo = JSON.stringify(response.data, undefined, 2);
      $scope.countTest += 1;
      return {
        'rows': response.data.rows,
        'header': response.data.header,
        'sortBy': response.data['sort-by'],
        'sortOrder': response.data['sort-order']
      }
    });
  }

  $scope.getResourceTwo = function (params) {
    $scope.urlApiTwo = 'table.json?' + params;
    return $http.get($scope.urlApiTwo).then(function (response) {
      $scope.responseThree = JSON.stringify(response.data, undefined, 2);
      $scope.countTest += 1;
      return {
        'rows': response.data.rows,
        'header': response.data.header,
        'pagination': response.data.pagination,
        'sortBy': response.data['sort-by'],
        'sortOrder': response.data['sort-order']
      }
    });
  }

  $scope.getResourceThree = function (params) {
    $scope.urlApiThree = 'table.json?' + params;
    return $http.get($scope.urlApiThree).then(function (response) {
      $scope.responseFour = JSON.stringify(response.data, undefined, 2);
      $scope.countTest += 1;
      return {
        'rows': response.data.rows,
        'header': response.data.header
      }
    });
  }
}])
.controller('ServiceCtrl', ['$scope', '$http', function($scope, $http) {
}])
.controller('FilterCtrl', ['$scope', '$http', function($scope, $http) {
  $scope.start = 1;
  $scope.stop = 10;
  $scope.step = 2;
}]);
