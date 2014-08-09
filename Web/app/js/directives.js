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
    .directive('ytmAttendee', function() {
        return {
            restrict: 'E',
            templateUrl: 'partials/attendee/attendee.html'
        };
    })
    .directive('ytmSpeaker', function() {
        return {
            restrict: 'E',
            templateUrl: 'partials/speakersList/speaker.html'
        };
    })
    .directive('ytmSpeakersListAttendee', function() {
        return {
            restrict: 'E',
            templateUrl: 'partials/speakersList/attendee.html'
        };
    })
    .directive('ytmVote', function() {
        return {
            restrict: 'E',
            templateUrl: 'partials/poll/vote.html'
        };
    });