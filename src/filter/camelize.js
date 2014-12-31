/**
 * @ngdoc filter
 * @name filterCamelize
 * @kind function
 *
 */
var CAMELIZE_REGEX = /(?:^|[-_])(\w)/g;
angular.module('ngTasty.filter.camelize', [])
.filter('camelize', function() {
  return function (input, first) {
	  var isString = typeof input === 'string',
	  	  first = typeof first === 'undefined' ? false : !!first;
	  
	  if(typeof input === 'undefined' || input === null || (!isString && isNaN(input)) ) {
		  return '';
	  }

	  if(!isString){
		  return '' + input;
	  }
	  
	  return input.replace(CAMELIZE_REGEX, function (_, c, pos) {
		return c && (first || pos > 0) ? c.toUpperCase () : c;
	  });
  };
});
