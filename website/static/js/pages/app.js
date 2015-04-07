angular.module('myApp.pages.app', [])
.controller('AppCtrl', function($rootScope, $scope, $window, $location, $modal) {
  var modalInstance;

  if (base == '/ng-tasty') {
    $scope.$on('$viewContentLoaded', function(event) {
      $window.ga('send', 'pageview', { page: '/ng-tasty' + $location.path() });
    });
  }
  $rootScope.version = '0.5.3';

  $scope.showDownloadModal = function() {
    modalInstance = $modal.open({
      templateUrl: 'downloadModal.html',
      controller: 'DownloadCtrl'
    });
  };

  angular.element($window).bind("scroll", function() {
    $scope.$evalAsync(function () {
      if (pageYOffset > 200) {
        $rootScope.pageYOffset = (pageYOffset - 180);
      } else {
        $rootScope.pageYOffset = '0';
      }
    });
  });
})
.controller('DownloadCtrl', function($rootScope, $scope, $modalInstance) {
  $scope.options = {
    version: $rootScope.version,
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
    $modalInstance.dismiss('cancel');
  };
});
