/**
 * @ngdoc service
 * @name ngTasty.service.joinObjects
 * @description
 *
 */
angular.module('ngTasty.service.joinObjects', ['ngTasty.service.setProperty'])
.factory('joinObjects', function(setProperty) {
  return function(objOne, objTwo, listKeyNotJoin) {
    listKeyNotJoin = listKeyNotJoin || [];
    for (var attrname in objTwo) {
      if (listKeyNotJoin.indexOf(attrname) < 0) {
        setProperty(objOne, objTwo, attrname);
      }
    }
    return objOne;
  };
});
