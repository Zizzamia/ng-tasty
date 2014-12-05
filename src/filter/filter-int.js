/**
 * @ngdoc filter
 * @name filterInt
 * @kind function
 *
 */
angular.module('ngTasty.filter.filterInt', [])
.filter('filterInt', function() {
  return function (input) {
    if(/^(\-|\+)?([0-9]+|Infinity)$/.test(input)) {
      return Number(input);
    }
    return NaN;
  };
});
