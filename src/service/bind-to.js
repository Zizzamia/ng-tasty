/**
 * @ngdoc service
 * @name ngTasty.service.bindTo
 * @description
 *
 * Set up $watches for isolate scope and controller bindings. This process
 * only occurs for isolate scopes and new scopes with controllerAs.
 */
angular.module('ngTasty.service.bindTo', [])
.factory('bindTo', function($parse) {
  return function (scopeName, scope, attrs, newScopeName) {
    var lastValue, parentGet, compare, parentSet, 
    parentValueWatch, isolateScopeName;
    if (!attrs[scopeName]) {
      return;
    }
    parentGet = $parse(attrs[scopeName]);
    if (parentGet.literal) {
      compare = angular.equals;
    } else {
      compare = function(a,b) { return a === b || (a !== a && b !== b); };
    }
    if (newScopeName) {
      isolateScopeName = newScopeName;
    } else {
      isolateScopeName = scopeName;
    }
    parentSet = parentGet.assign || function() {
      // reset the change, or we will throw this exception on every $digest
      lastValue = scope[scopeName] = parentGet(scopeName);
      throw 'Expression ' + attrs[attrName] + ' is non-assignable!';
    };
    lastValue = scope[isolateScopeName] = parentGet(scope.$parent);
    parentValueWatch = function parentValueWatch(parentValue) {
      if (!compare(parentValue, scope[isolateScopeName])) {
        // we are out of sync and need to copy
        if (!compare(parentValue, lastValue)) {
          // parent changed and it has precedence
          scope[isolateScopeName] = parentValue;
        } else {
          // if the parent can be assigned then do so
          parentSet(scope.$parent, parentValue = scope[isolateScopeName]);
        }
      }
      return lastValue = parentValue;
    };
    parentValueWatch.$stateful = true;
    scope.$parent.$watch($parse(attrs[scopeName], parentValueWatch), null, parentGet.literal);
  };
});
