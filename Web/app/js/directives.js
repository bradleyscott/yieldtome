'use strict';

/* Directives */


angular.module('yieldtome.directives', [])
    .directive('ytmHomeMenu', function() {
        return {
            restrict: 'E',
            templateUrl: 'partials/menus/homeMenu.html'
        };
    })
    .directive('ytmMenu', function() {
        return {
            restrict: 'E',
            templateUrl: 'partials/menus/menu.html'
        };
    })
    .directive('ytmNavMenu', function() {
        return {
            restrict: 'E',
            templateUrl: 'partials/menus/navMenu.html'
        };
    })
    .directive('ytmAttendeeList', function() {
        return {
            restrict: 'E',
            scope: {
                attendees: '='
            },
            templateUrl: 'partials/attendeeList.html'
        };
    })
    .directive('ytmSpeakerCarousel', function() {
        return {
            restrict: 'E',
            templateUrl: 'partials/speakerCarousel.html'
        };
    })
    .directive('ytmSpeakerList', function() {
        return {
            restrict: 'E',
            templateUrl: 'partials/speakerList.html'
        };
    });