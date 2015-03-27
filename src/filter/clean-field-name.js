/**
 * @ngdoc filter
 * @name ngTasty.filter.cleanFieldName
 * @function
 *
 * @description
 * Calling cleanFieldName will replace all 
 * empty space with with -
 *
 * @example
  ng-bind="key | cleanFieldName"
 *
 */
angular.module('ngTasty.filter.cleanFieldName', [])
.filter('cleanFieldName', function() {
  return function (input) {
    return input.replace(/[^a-zA-Z0-9-_-]+/g, '-');
  };
});
