'use strict';

/* Directives */


angular.module('yieldtome.directives', [])
  .directive('homemenu', function() {
    return {
      restrict: 'E',
      templateUrl: 'partials/homeMenu.html'
    };
  });
