/**
 * @ngdoc filter
 * @name cleanFieldName
 *
 * @description
 * Calling toString will return the ...
 *
 * @example
  ng-bind="key | cleanFieldName"
 *
 */
angular.module('ngTasty.filter.cleanFieldName', [])
.filter('cleanFieldName', function() {
  return function (input) {
    return input.replace(/[^a-zA-Z0-9-]+/g, '-');
  };
});
