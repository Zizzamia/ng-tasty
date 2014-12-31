/**
 * @ngdoc filter
 * @name filterCamelize
 * @kind function
 *
 */
angular.module('ngTasty.filter.camelize', [])
.filter('camelize', function() {
  var CAMELIZE_REGEX = /(?:^|[-_ ])(\w)/g;
  return function (input, first) {
	  var isString = typeof input === 'string',
	  	  first = typeof first === 'undefined' ? false : !!first;
	  
	  if(typeof input === 'undefined' || input === null || (!isString && isNaN(input)) ) {
		  return '';
	  }

	  if(!isString){
		  return '' + input;
	  }
	  
	  return input
	  			.trim() //remove trailing spaces
	  			.replace(/ +(?= )/g,'') //remove multiple WS
	  			.replace(CAMELIZE_REGEX, function (_, c, pos) { //actual conversion
	  				return c && (first || pos > 0) ? c.toUpperCase () : c;
				});
  };
});
