'use strict';

/* Controllers */

angular.module('yieldtome.controllers')

.controller('Events', ['$scope', '$location', '$log', '$window', 'EventService', 'AttendeeService',
    function($scope, $location, $log, $window, EventService, AttendeeService) {

        $log.debug("Events controller executing");

        $scope.error; // An error message that will be displayed to screen
        $scope.info; // An info message that will be displayed to screen
        $scope.profile;  // The authenticated Profile, if it exists
        $scope.events; // List of Events
        $scope.selectedEvent; // The Event the user selected
        $scope.attendees; // Attendees for the selected Event

        $scope.$back = function() {
            window.history.back();
        };

        $scope.selectEvent = function(selectedEvent) {

            // Set the seleted Event
            if (selectedEvent) {
                $log.debug('User selected Event with EventID=' + selectedEvent.EventID);
                $scope.selectedEvent = selectedEvent;
            } else {
                $log.debug('User de-selected Event with EventID=' + $scope.selectedEvent.EventID);
                $scope.selectedEvent = selectedEvent;
                return;
            }

            // Get Attendees for the selected Event
            $log.debug('Retrieving Attendees');
            var promise = AttendeeService.getAttendees($scope.selectedEvent);

            promise.then(function(attendees) {
                $scope.attendees = attendees;
            })
            .catch (function(error) {
                $log.warn(error);
                $scope.error = "Something wen't wrong trying to get the list of Attendees";
            });
        };

        // Get Events from EventService
        (function() {
            $log.debug('Retrieving Events to create model');

            // Allocate the saved Profile to the controller
            if($window.sessionStorage.profile != "undefined")
            { $scope.profile = JSON.parse($window.sessionStorage.profile); }

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
