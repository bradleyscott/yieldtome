'use strict';

/* Directives */


angular.module('yieldtome.directives', [])
    .directive('homemenu', function() {
        return {
            restrict: 'E',
            templateUrl: 'partials/homeMenu.html'
        };
    })
    .directive('menu', function() {
        return {
            restrict: 'E',
            templateUrl: 'partials/menu.html'
        };
    })
    .directive('navmenu', function() {
        return {
            restrict: 'E',
            templateUrl: 'partials/navMenu.html'
        };
    })
    .directive('attendeelist', function() {
        return {
            restrict: 'E',
            templateUrl: 'partials/attendeeList.html'
        };
    });
