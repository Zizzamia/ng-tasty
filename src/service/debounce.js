/**
 * @ngdoc service
 * @name ngTasty.service.debounce
 * @description
 *
 */
angular.module('ngTasty.service.debounce', [])
.factory('debounce', function ($timeout) {
  return function (func, wait, immediate) {
    var args, context, debounceTimeout, timeout;
    debounceTimeout = function() {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    return function debounce () {
      context = this;
      args = arguments;
      var callNow = immediate && !timeout;
      $timeout.cancel(timeout);
      timeout = $timeout(debounceTimeout, wait);
      if (callNow) {
        func.apply(context, args);
      }
    };
  };
});
