/**
 * @ngdoc service
 * @name ngTasty.service.debounce
 * @description
 *
 */
angular.module('ngTasty.service.debounce', [])
.factory('debounce', function($timeout) {
  return function (func, wait, immediate) {
    var timeout;
    return function debounce () {
      var context = this, args = arguments;
      $timeout.cancel(timeout);
      timeout = $timeout(function debounceTimeout () {
        timeout = null;
        func.apply(context, args);
      }, wait);
    };
  };
});
