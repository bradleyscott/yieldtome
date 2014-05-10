'use strict';

/* Directives */


angular.module('yieldtome.directives', [])
    .directive('homemenu', function() {
        return {
            restrict: 'E',
            templateUrl: 'partials/homeMenu.html'
        };
    })
    .directive('emptymenu', function() {
        return {
            restrict: 'E',
            templateUrl: 'partials/emptyMenu.html'
        };
    });
