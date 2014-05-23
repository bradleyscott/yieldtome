'use strict';

/* Directives */


angular.module('yieldtome.directives', [])
    .directive('homemenu', function() {
        return {
            restrict: 'E',
            templateUrl: 'partials/homeMenu.html'
        };
    })
    .directive('eventsmenu', function() {
        return {
            restrict: 'E',
            templateUrl: 'partials/eventsMenu.html'
        };
    })
    .directive('attendeelist', function() {
        return {
            restrict: 'E',
            templateUrl: 'partials/attendeeList.html'
        };
    });
