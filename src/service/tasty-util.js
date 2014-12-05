try {
  var debounce = angular.module('ngTasty.service.debounce');
} catch (e) {
  var debounce = angular.module('ngTasty.service.debounce', []);
}
try {
  var setProperty = angular.module('ngTasty.service.setProperty');
} catch (e) {
  var setProperty = angular.module('ngTasty.service.setProperty', []);
}
try {
  var setProperty = angular.module('ngTasty.service.joinObjects');
} catch (e) {
  var joinObjects = angular.module('ngTasty.service.joinObjects', []);
}

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
