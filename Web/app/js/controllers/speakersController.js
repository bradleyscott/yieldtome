'use strict';

/* Controllers */

angular.module('yieldtome.controllers')

.controller('SpeakersList', ['$scope', '$location', '$log', '$window', 'SessionService', 'SpeakersService',
    function($scope, $location, $log, $window, SessionService, SpeakersService) {

        $log.debug("Speakers controller executing");

        $scope.error; // An error message that will be displayed to screen
        $scope.info; // An info message that will be displayed to screen
        $scope.profile; // The authenticated Profile, if it exists
        $scope.event; // Selected Event
        $scope.attendee; // Attendee record for this Profile
        $scope.lists; // All the Speakers lists for the Event

        $scope.$back = function() {
            window.history.back();
        };

        // Controller initialize
        (function() {
            $log.debug('Retrieving SpeakersList to create model');

            // Allocate the saved Profile to the controller
            $scope.profile = SessionService.get('profile');

            var promise = EventService.getEvents();

            promise.then(function(events) {
                $scope.events = events;
            })
            .catch (function(error) {
                $log.warn(error);
                $scope.error = "Something wen't wrong trying to get the list of yieldto.me Events";
            });
        })();
    }
]);
