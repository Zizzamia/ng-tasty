/**
 * @ngdoc 
 * @name 
 *
 */
angular.module('ngTasty.filter', [
  'ngTasty.filter.cleanFieldName',
  'ngTasty.filter.filterInt',
  'ngTasty.filter.range'
]);

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

/**
 * @ngdoc filter
 * @name range
 * @kind function
 *
 * @description
 * Create a list containing arithmetic progressions. The arguments must 
 * be plain integers. If the step argument is omitted, it defaults to 1. 
 * If the start argument is omitted, it defaults to 0.
 *
 * @example
  ng-repeat="n in [] | range:1:30"
 */
angular.module('ngTasty.filter.range', [])
.filter('range', function($filter) {
  return function(input, start, stop, step) {
    start = $filter('filterInt')(start);
    stop = $filter('filterInt')(stop);
    step = $filter('filterInt')(step);
    if (isNaN(start)) {
      start = 0;
    }
    if (isNaN(stop)) {
      stop = start;
      start = 0;
    }
    if (isNaN(step)) {
      step = 1;
    }
    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)){
      return [];
    }
    for (var i = start; step > 0 ? i < stop : i > stop; i += step){
      input.push(i);
    }
    return input;
  };
});
