/**
 * @ngdoc filter
 * @name filterCamelize
 * @kind function
 *
 */
angular.module('ngTasty.filter.camelize', [])
.filter('camelize', function() {
  return function (input) {
	  var isString = typeof input === 'string';
	  
	  if(typeof input === 'undefined' || input === null || (!isString && isNaN(input)) ) {
		  return '';
	  }

	  if(!isString){
		  return '' + input;
	  }
	  
	  return input.replace(/(?:^|[-_])(\w)/g, function (_, c) {
		return c ? c.toUpperCase () : '';
	  });
  };
});
