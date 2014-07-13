'use strict';

/* Controllers */

angular.module('yieldtome.controllers')

.controller('Events', ['$scope', '$location', '$log', 'SessionService', 'EventService', 'AttendeeService',
    function($scope, $location, $log, SessionService, EventService, AttendeeService) {

        $log.debug("Events controller executing");

        $scope.error; // An error message that will be displayed to screen
        $scope.info; // An info message that will be displayed to screen
        $scope.profile; // The authenticated Profile, if it exists
        $scope.events; // List of Events
        $scope.selectedEvent; // The Event the user selected
        $scope.attendees; // Attendees for the selected Event

        $scope.$back = function() {
            window.history.back();
        };

        $scope.edit = function(event, $event) {
            // Prevent bubbling to showItem.
            // On recent browsers, only $event.stopPropagation() is needed
            if ($event.stopPropagation) $event.stopPropagation();
            if ($event.preventDefault) $event.preventDefault();
            $event.cancelBubble = true;
            $event.returnValue = false;

            $log.debug('User clicked the Edit button for EventID: ' + event.EventID);
            $location.path('/editEvent/' + event.EventID);
        };

        $scope.attend = function() {
            $log.debug('User clicked the Attend button');
            SessionService.set('event', $scope.selectedEvent); // Save the selectedEvent to session
            $location.path('/attend');
        };

        $scope.new = function() {
            $log.debug('User clicked the New Event button');
            $location.path('/createEvent');
        };

        $scope.selectEvent = function(selectedEvent) {
            $scope.info = ""; // Clear any info messages
            $scope.error = ""; // Clear any error messages

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
                $scope.attendees = attendees; // Display attendees to screen

                // If this profile is already attending, redirect them to the landing page
                for (var i = 0; i < $scope.attendees.length; i++) {
                    if ($scope.attendees[i].Profile.ProfileID == $scope.profile.ProfileID) {
                        $log.debug('ProfileID ' + $scope.profile.ProfileID + ' is attending Event ' + selectedEvent.EventID);
                        $log.debug('Redirecting to landing page');
                        $scope.info = "You are attending this Event. Logging you in...";
                        SessionService.set('event', $scope.selectedEvent); // Save the selectedEvent to session
                        SessionService.set('attendee', $scope.attendees[i]); // Save the Attendee to session
                        $location.path('/landing');
                    }
                }
            })
            .catch (function(error) {
                $log.warn(error);
                $scope.error = "Something went wrong trying to get the list of Attendees";
            });

        };

        // Get Events from EventService
        (function() {
            $log.debug('Retrieving Events to create model');

            // Allocate the saved Profile to the controller
            $scope.profile = SessionService.get('profile');
            var promise = EventService.getEvents();

            promise.then(function(events) {
                $scope.events = events;
            })
            .catch (function(error) {
                $log.warn(error);
                $scope.error = "Something went wrong trying to get the list of yieldto.me Events";
            });
        })();
    }
]);
