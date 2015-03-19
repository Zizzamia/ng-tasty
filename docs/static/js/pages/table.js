angular.module('myApp.pages.table', [])
.factory('tableResource', function () {
  return {
    'rows': [
      { 'name': 'Ritual Coffee Roasters', 'star': '★★★★★', 'sf-Location': 'Hayes Valley'},
      { 'name': 'Blue Bottle', 'star': '★★★★★', 'sf-Location': 'Hayes Valley' },
      { 'name': 'CoffeeShop', 'star': '★★★', 'sf-Location': 'Bernal Heights' },
      { 'name': 'Spike\'s Coffee & Teas', 'star': '★★★', 'sf-Location': 'Castro' },
      { 'name': 'La Boulange', 'star': '★★', 'sf-Location': 'Cole Valley' },
      { 'name': 'Dynamo Donut and Coffee', 'star': '★★★★★', 'sf-Location': 'Cow Hollow' },
      { 'name': 'The Mill', 'star': '★★★★', 'sf-Location': 'Divisadero' },
      { 'name': 'Piccino Coffee Bar', 'star': '★★★', 'sf-Location': 'Dogpatch' },
      { 'name': 'Philz', 'star': '★★★', 'sf-Location': 'Downtown' },
      { 'name': 'Duboce Park Cafe', 'star': '★★', 'sf-Location': 'Duboce Triangle' },
      { 'name': 'Blue Bottle', 'star': '★★★★★', 'sf-Location': 'Embarcadero' },
      { 'name': 'Four Barrel', 'star': '★★★', 'sf-Location': 'Excelsior' },
      { 'name': 'Coffee Bar', 'star': '★★★★★', 'sf-Location': 'FiDi' },
      { 'name': 'Biscoff Coffee Corner', 'star': '★★★', 'sf-Location': 'Fisherman’s Wharf' },
      { 'name': 'Fifty/Fifty Coffee and Tea', 'star': '★★★', 'sf-Location': 'Inner Richmond' },
      { 'name': 'Beanery', 'star': '★★★', 'sf-Location': 'Inner Sunset' },
      { 'name': 'Cafe du Soleil', 'star': '★★', 'sf-Location': 'Lower Haight' },
      { 'name': 'Peet\'s', 'star': '★', 'sf-Location': 'The Marina' },
      { 'name': 'Sightglass', 'star': '★★★★', 'sf-Location': 'The Mission' },
      { 'name': 'Contraband Coffee Bar', 'star': '★★★★', 'sf-Location': 'Nob Hill' },
      { 'name': 'Martha & Bros Coffee', 'star': '★★★', 'sf-Location': 'Noe Valley' },
      { 'name': 'Réveille', 'star': '★★★', 'sf-Location': 'North Beach' },
      { 'name': 'Cup Coffee Bar', 'star': '★★★', 'sf-Location': 'Outer Mission' },
      { 'name': 'Garden House Cafe', 'star': '★★★', 'sf-Location': 'Outer Richmond' },
      { 'name': 'Andytown Coffee Roasters', 'star': '★★★', 'sf-Location': 'Outer Sunset' },
      { 'name': 'Jane on Fillmore', 'star': '★★', 'sf-Location': 'Pacific Heights' },
      { 'name': 'Saint Frank Coffee', 'star': '★★★', 'sf-Location': 'Polk' },
      { 'name': 'Farley’s', 'star': '★★★', 'sf-Location': 'Potrero Hill' },
      { 'name': 'House of Snacks', 'star': '★★★', 'sf-Location': 'The Presidio' },
      { 'name': 'The Brew', 'star': '★★★', 'sf-Location': 'Russian Hill' },
      { 'name': 'Wicked Grounds', 'star': '★★★', 'sf-Location': 'SOMA' },
      { 'name': 'farm:table', 'star': '★★★', 'sf-Location': 'Tenderloin' },
      { 'name': 'Starbucks', 'star': '★', 'sf-Location': 'Union Square' },
      { 'name': 'Flywheel Coffee Roasters', 'star': '★★★★★', 'sf-Location': 'Upper Haight' }
    ]
  }
})
.controller('TableSimpleCtrl', function($rootScope, $scope, $http, $timeout, tableResource) {
  $rootScope.page = 'table';
  $rootScope.innerPage = 'simple';
  $scope.resourceSimple = {
    'header': [
      { 'name': 'Name' },
      { 'star': 'Star' },
      { 'sf-Location': 'SF Location' }
    ],
    'rows': tableResource.rows
  };
  $timeout(function () {
    Rainbow.color();
  });
})
.controller('TableSimpleHttpCtrl', function($rootScope, $scope, $http, $timeout, tableResource) {
  $rootScope.page = 'table';
  $rootScope.innerPage = 'simple-http';
  $scope.resource = {
    'header': [
      { 'name': 'Name' },
      { 'star': 'Star' },
      { 'sf-Location': 'SF Location' }
    ],
    'rows': []
  };
  $http.get('table.json').then(function (response) {
    $scope.resource.rows = response.data.rows;
    updateDocs();
  });
  var updateDocs = function (newValue) {
    $scope.resourceJson = JSON.stringify(newValue, undefined, 2);
    $scope.$evalAsync(function () {
      Rainbow.color();
    });
  };
  $scope.$watch('resource', updateDocs, true);
  $scope.$evalAsync(function () {
    Rainbow.color();
  });
})
.controller('TableCompleteCtrl', function($rootScope, $scope, $timeout, tableResource) {
  $rootScope.page = 'table';
  $rootScope.innerPage = 'complete';
  $scope.resource = {
    'header': [
      { 'name': 'Name' },
      { 'star': 'Star' },
      { 'sf-Location': 'SF Location' }
    ],
    'rows': tableResource.rows,
    'sortBy': 'name',
    'sortOrder': 'asc'
  };

  var updateDocs = function () {
    $scope.resourceJson = JSON.stringify($scope.resource, undefined, 2);
    $scope.$evalAsync(function () {
      Rainbow.color();
    });
  };
  $scope.$watch('resource', updateDocs, true);
  $scope.$evalAsync(function () {
    Rainbow.color();
  });
})
.controller('TableSortingCtrl', function($rootScope, $scope, $timeout, tableResource) {
  $rootScope.page = 'table';
  $rootScope.innerPage = 'sorting';
  $scope.resource = {
    'header': [
      { 'key': 'name', 'name': 'Name', 'style': {'width': '50%'} },
      { 'key': 'sf-Location', 'name': 'SF Location', 'style': {'width': '35%'} },
      { 'key': 'star', 'name': 'Star', 'style': {'width': '15%'}, 'class': ['text-right'] }
    ],
    'rows': tableResource.rows,
    'sortBy': 'star',
    'sortOrder': 'dsc'
  };
  $scope.notSortBy = ['sf-Location'];
  $timeout(function () {
    Rainbow.color();
  });
})
.controller('TablePaginationCtrl', function($rootScope, $scope, $timeout, tableResource) {
  $rootScope.page = 'table';
  $rootScope.innerPage = 'pagination';
  $scope.resource = {
    'header': [
      { 'name': 'Name' },
      { 'star': 'Star' },
      { 'sf-Location': 'SF Location' }
    ],
    'rows': tableResource.rows,
    'pagination': {
      'page': 2
    }
  };
  $scope.itemsPerPage = 20;
  $scope.listItemsPerPage = [10, 20, 40, 80];
  $timeout(function () {
    Rainbow.color();
  });
})
.controller('TableFiltersCtrl', function($rootScope, $scope, $timeout, tableResource) {
  $rootScope.page = 'table';
  $rootScope.innerPage = 'filters';
  $scope.resource = {
    'header': [
      { 'name': 'Name' },
      { 'star': 'Star' },
      { 'sf-Location': 'SF Location' }
    ],
    'rows': tableResource.rows,
  };
  $scope.filters = 'rit';

  $timeout(function () {
    Rainbow.color();
  }); 
})
.controller('BenchmarksTableCtrl', function($rootScope, $scope, $http, $timeout) {
  var rows = []
  for (var i = 0; i < 4000; i++) {
    rows.push({ 
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
  $scope.resource = {
    'header': [
      { 'name': 'Name' },
      { 'star': 'Star' },
      { 'sf-Location': 'SF Location' }
    ],
    'rows': rows,
    'sortBy': 'name',
    'sortOrder': 'asc'
  };
})
.controller('TableCustomPaginationCtrl', function($rootScope, $scope, $timeout, tableResource) {
  $rootScope.page = 'table';
  $rootScope.innerPage = 'custom-pagination';
  $scope.resource = {
    'header': [
      { 'name': 'Name' },
      { 'star': 'Star' },
      { 'sf-Location': 'SF Location' }
    ],
    'rows': tableResource.rows,
    'pagination': {
      'page': 2
    }
  };
  $timeout(function () {
    Rainbow.color();
  });
})
.controller('TableCustomSortingCtrl', function($rootScope, $scope, $timeout, tableResource) {
  $rootScope.page = 'table';
  $rootScope.innerPage = 'custom-sorting';
  $scope.resource = {
    'header': [
      { 'key': 'name', 'name': 'Name', 'style': {'width': '50%'} },
      { 'key': 'star', 'name': 'Star', 'style': {'width': '15%'} },
      { 'key': 'sf-Location', 'name': 'SF Location', 'style': {'width': '35%'} }
    ],
    'rows': tableResource.rows,
    'sortBy': 'star',
    'sortOrder': 'dsc'
  };
  $timeout(function () {
    Rainbow.color();
  });
})
.controller('TableCustomThemeCtrl', function($rootScope, $scope, $timeout, tableResource) {
  $rootScope.page = 'table';
  $rootScope.innerPage = 'custom-theme';
  $scope.resource = {
    'header': [
      { 'name': 'Name' },
      { 'star': 'Star' },
      { 'sf-Location': 'SF Location' }
    ],
    'rows': tableResource.rows,
    'sortBy': 'name',
    'sortOrder': 'asc'
  };
  $scope.customTheme = {
    iconUp: 'fa fa-chevron-circle-up',
    iconDown: 'fa fa-chevron-circle-down',
    listItemsPerPage: [5, 10, 20, 30],
    itemsPerPage: 10
  };
  $timeout(function () {
    Rainbow.color();
  });
});
