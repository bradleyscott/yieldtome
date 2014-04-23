'use strict';

/* Directives */


angular.module('yieldtome.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])
  .directive('homemenu', function() {
    return {
      restrict: 'E',
      templateUrl: 'partials/homeMenu.html'
    };
  });
