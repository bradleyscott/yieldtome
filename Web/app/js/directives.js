'use strict';

/* Directives */


angular.module('yieldtome.directives', [])
    .directive('homemenu', function() {
        return {
            restrict: 'E',
            templateUrl: 'partials/menus/homeMenu.html'
        };
    })
    .directive('menu', function() {
        return {
            restrict: 'E',
            templateUrl: 'partials/menus/menu.html'
        };
    })
    .directive('navmenu', function() {
        return {
            restrict: 'E',
            templateUrl: 'partials/menus/navMenu.html'
        };
    })
    .directive('attendeelist', function() {
        return {
            restrict: 'E',
            templateUrl: 'partials/attendeeList.html'
        };
    });
