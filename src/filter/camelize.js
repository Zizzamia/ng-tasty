/**
 * @ngdoc filter
 * @name ngTasty.filter.filterCamelize
 * @function
 *
 */
angular.module('ngTasty.filter.camelize', [])
.filter('camelize', function() {
  var CAMELIZE_REGEX = /(?:^|[-_ ])(\w)/g;
  
  return function (input, first) {
    var isString = typeof input === 'string',
        firstLetter = typeof first === 'undefined' ? false : !!first;
    
    if(typeof input === 'undefined' || 
       input === null || 
       (!isString && isNaN(input)) ) {
      return '';
    }

    if(!isString){
      return '' + input;
    }
    
    return input.trim() // remove trailing spaces
      .replace(/ +(?= )/g,'') // remove multiple WS
      .replace(CAMELIZE_REGEX, function (_, character, pos) { // actual conversion
        if (character && (firstLetter || pos > 0)) {
          return character.toUpperCase();
        } else {
          return character;
        }
      });
  };
});
