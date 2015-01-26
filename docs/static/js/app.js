angular.module('myApp', [
  'ngRoute',
  'ngTasty',
  'ui.bootstrap',
  'myApp.pages.app',
  'myApp.pages.home',
  'myApp.pages.contribute',
  'myApp.pages.makeYourOwn',
  'myApp.pages.table',
  'myApp.pages.tableServerSide',
  'myApp.pages.filter',
  'myApp.pages.debounce',
  'myApp.pages.throttle',
  'myApp.pages.webSocket'
])
.config(function ($locationProvider, $routeProvider) {
  $routeProvider
  .when('/', {
    controller: 'HomeCtrl',
    templateUrl: 'home.html',
    title: '#ngTasty'
  })
  .when('/contribute', {
    controller: 'ContributeCtrl',
    templateUrl: 'contribute.html',
    title: '#ngTasty - Contribute'
  })
  .when('/make-your-own', {
    controller: 'MakeYourOwnCtrl',
    templateUrl: 'make-your-own.html',
    title: '#ngTasty - Make your own tasty collection'
  })
  .when('/directive/table', {
    controller: 'TableCompleteCtrl',
    templateUrl: 'table/index.html',
    title: '#ngTasty - AngularJS table directive'
  })
  .when('/directive/table/complete', {
    controller: 'TableCompleteCtrl',
    templateUrl: 'table/index.html',
    title: '#ngTasty - AngularJS table directive'
  })
  .when('/directive/table/sorting', {
    controller: 'TableSortingCtrl',
    templateUrl: 'table/index.html',
    title: '#ngTasty - AngularJS table directive'
  })
  .when('/directive/table/pagination', {
    controller: 'TablePaginationCtrl',
    templateUrl: 'table/index.html',
    title: '#ngTasty - AngularJS table directive'
  })
  .when('/directive/table/filters', {
    controller: 'TableFiltersCtrl',
    templateUrl: 'table/index.html',
    title: '#ngTasty - AngularJS table directive'
  })
  .when('/directive/table-server-side', {
    controller: 'TableServerSideCompleteCtrl',
    templateUrl: 'table-server-side/index.html',
    title: '#ngTasty - AngularJS server side table directive'
  })
  .when('/directive/table-server-side/complete', {
    controller: 'TableServerSideCompleteCtrl',
    templateUrl: 'table-server-side/index.html',
    title: '#ngTasty - AngularJS server side table directive'
  })
  .when('/directive/table-server-side/sorting', {
    controller: 'TableServerSideSortingCtrl',
    templateUrl: 'table-server-side/index.html',
    title: '#ngTasty - AngularJS server side table directive'
  })
  .when('/directive/table-server-side/pagination', {
    controller: 'TableServerSidePaginationCtrl',
    templateUrl: 'table-server-side/index.html',
    title: '#ngTasty - AngularJS server side table directive'
  })
  .when('/directive/table-server-side/filters', {
    controller: 'TableServerSideFiltersCtrl',
    templateUrl: 'table-server-side/index.html',
    title: '#ngTasty - AngularJS server side table directive'
  })
  .when('/filter/filter-int', {
    controller: 'FilterCtrl',
    templateUrl: 'filter/filter-int.html',
    title: '#ngTasty - AngularJS filter Integer'
  })
  .when('/filter/range', {
    controller: 'RangeCtrl',
    templateUrl: 'filter/range.html',
    title: '#ngTasty - AngularJS range filter'
  })
  .when('/filter/camelize', {
    controller: 'CamelizeCtrl',
    templateUrl: 'filter/camelize.html',
    title: '#ngTasty - AngularJS camelize filter'
  })
  .when('/filter/slugify', {
    controller: 'SlugifyCtrl',
    templateUrl: 'filter/slugify.html',
    title: '#ngTasty - AngularJS slugify filter'
  })
  .when('/service/debounce', {
    controller: 'DebounceCtrl',
    templateUrl: 'service/debounce.html',
    title: '#ngTasty - AngularJS debounce service'
  })
  .when('/service/throttle', {
    controller: 'ThrottleCtrl',
    templateUrl: 'service/throttle.html',
    title: '#ngTasty - AngularJS throttle service'
  })
  .when('/service/websocket', {
    controller: 'WebSocketCtrl',
    templateUrl: 'service/websocket.html',
    title: '#ngTasty - AngularJS websocket service'
  })
  .when('/benchmarks/table', {
    controller: 'BenchmarksTableCtrl',
    templateUrl: 'table/benchmarks.html',
    title: '#ngTasty - AngularJS benchmarks table'
  })
  .otherwise({ redirectTo: '/' });

  $locationProvider.html5Mode(true);
})
.run(function ($rootScope, $route) {
  $rootScope.$on('$routeChangeSuccess', function(currentRoute, previousRoute){
    //Change page title, based on Route information
    $rootScope.title = $route.current.title;
  });
});
