/**
 * @ngdoc 
 * @name 
 *
 */
angular.module('ngTasty.service.debounce', [])
.factory('debounce', function($timeout) {
  return function(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      $timeout.cancel(timeout);
      timeout = $timeout(function() {
        timeout = null;
        func.apply(context, args);
      }, wait);
    };
  };
});
