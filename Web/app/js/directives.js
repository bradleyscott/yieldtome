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
            templateUrl: 'partials/speakersList/speakerCarousel.html'
        };
    })
    .directive('ytmEditableSpeakerList', function() {
        return {
            restrict: 'E',
            templateUrl: 'partials/speakersList/editableSpeakerList.html'
        };
    })
    .directive('ytmSpeakerList', function() {
        return {
            restrict: 'E',
            templateUrl: 'partials/speakersList/speakerList.html'
        };
    })
    .directive('ytmMyVote', function() {
        return {
            restrict: 'E',
            templateUrl: 'partials/poll/myVote.html'
        };
    })
    .directive('ytmVoteList', function() {
        return {
            restrict: 'E',
            templateUrl: 'partials/poll/voteList.html'
        };
    });