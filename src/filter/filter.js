/**
 * @ngdoc 
 * @name 
 *
 */
angular.module('ngTasty.filter', [
  'ngTasty.filter.cleanFieldName',
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
    return input.replace(/[^a-zA-Z0-9-]+/g, '-').toLowerCase();
  };
});

/**
 * @ngdoc range
 * @name toDateString
 *
 * @description
 * Calling range will return ...
 * I got ispiration of the code from this page
 * http://stackoverflow.com/questions/8273047/javascript-function-similar-to-python-range
 *
 * @example
  ng-repeat="n in [] | range:1:30"
 *
 */
angular.module('ngTasty.filter.range', [])
.filter('range', function() {
  return function(start, stop, step) {
    var list;
    list = [];
    if (typeof stop === 'undefined'){
      stop = start;
      start = 0;
    }
    if (typeof step === 'undefined'){
      step = 1;
    }
    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)){
      return [];
    }
    for (var i = start; step > 0 ? i < stop : i > stop; i += step){
      list.push(i);
    }
    return list;
  };
});
