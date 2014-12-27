/**
 * @ngdoc service
 * @name ngTasty.service.tastyUtil
 * @description
 *
 */
angular.module('ngTasty.service.tastyUtil', [
  'ngTasty.service.bindTo',
  'ngTasty.service.debounce',
  'ngTasty.service.setProperty',
  'ngTasty.service.joinObjects',
  'ngTasty.service.throttle',
  'ngTasty.service.webSocket'
])
.factory('tastyUtil', function(debounce, setProperty, joinObjects, 
  bindTo, webSocket, throttle) {
  return {
    'bindTo': bindTo,
    'debounce': debounce,
    'setProperty': setProperty,
    'joinObjects': joinObjects,
    'throttle': throttle,
    'webSocket': webSocket
  };
});
