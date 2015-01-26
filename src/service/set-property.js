/**
 * @ngdoc service
 * @name ngTasty.service.setProperty
 * @description
 *
 */
angular.module('ngTasty.service.setProperty', [])
.factory('setProperty', function() {
  return function(objOne, objTwo, attrname) {
    if (typeof objTwo[attrname] !== 'undefined' && 
        objTwo[attrname] !== null) {
      if (angular.isString(objTwo[attrname])) {
        if (objTwo[attrname].length) {
          objOne[attrname] = objTwo[attrname];
        }
      } else {
        objOne[attrname] = objTwo[attrname];
      }
    }
    return objOne;
  };
});
