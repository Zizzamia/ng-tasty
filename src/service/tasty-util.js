/**
 * @ngdoc 
 * @name 
 *
 */
angular.module('ngTasty.service.tastyUtil', [
  'ngTasty.service.debounce',
  'ngTasty.service.setProperty',
  'ngTasty.service.joinObjects'
])
.factory('tastyUtil', function(debounce, setProperty, joinObjects) {
  return {
    'debounce': debounce,
    'setProperty': setProperty,
    'joinObjects': joinObjects
  };
});
