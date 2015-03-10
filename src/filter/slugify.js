/**
 * @author https://github.com/bogdan-alexandrescu/ - @balx
 * @ngdoc filter
 * @name ngTasty.filter.slugify
 * @function
 *
 * @description
 * Transform text into an ascii slug by replacing whitespaces, accentuated, 
 * and special characters with the coresponding latin character or completely 
 * removing them when no latin equivalent is found. This can be used safely to 
 * generate valid URLs.
 */
angular.module('ngTasty.filter.slugify', [])
.filter('slugify', function () {

  var makeString = function (object) {
    if (object == null) {
      return '';
    }
    return '' + object;
  };

  var from  = 'ąàáäâãåæăćčĉęèéëêĝĥìíïîĵłľńňòóöőôõðøśșšŝťțŭùúüűûñÿýçżźž',
      to    = 'aaaaaaaaaccceeeeeghiiiijllnnoooooooossssttuuuuuunyyczzz',
      regex = new RegExp('[' + from + ']', 'g');

  return function (str) {
    str = makeString(str)
    .toString() // make sure is a string
    .toLowerCase()
    .replace(regex, function (c){
      var index = from.indexOf(c);
      return to.charAt(index) || '-';
    }) // normalize some foreign characters
    .replace(/[^\w\-\s]+/g, '') // remove unwanted characters
    .trim() //trim spaces
    .replace(/\s+/g, '-') // replace any space with a dash
    .replace(/\-\-+/g, '-'); // remove duplicate dashes
    return str;
  };
});
  