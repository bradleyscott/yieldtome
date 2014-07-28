'use strict';

/* Controllers */

angular.module('yieldtome.controllers')

.controller('Events', ['$scope', '$location', '$log', 'growl', 'SessionService', 'EventService', 'AttendeeService',
    function($scope, $location, $log, growl, SessionService, EventService, AttendeeService) {

        $log.debug("Events controller executing");

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

            // Set the seleted Event
            if (selectedEvent) {
                // Get Attendees for the selected Event
                $log.debug('Retrieving Attendees');
                var promise = AttendeeService.getAttendees(selectedEvent);

                promise.then(function(attendees) {
                    // If this profile is already attending, redirect them to the landing page
                    for (var i = 0; i < attendees.length; i++) {
                        if (attendees[i].Profile.ProfileID == $scope.profile.ProfileID) {

                            $log.debug('ProfileID ' + $scope.profile.ProfileID + ' is attending Event ' + selectedEvent.EventID);
                            $log.debug('Redirecting to landing page');
                            
                            growl.addInfoMessage("You are attending " + selectedEvent.Name + " as " + attendees[i].Name);
                            SessionService.set('event', selectedEvent); // Save the selectedEvent to session
                            SessionService.set('attendee', attendees[i]); // Save the Attendee to session
                            $location.path('/landing');
                        }
                    }

                    // Update the screen 
                    $log.debug('User selected Event with EventID=' + selectedEvent.EventID);
                    $scope.selectedEvent = selectedEvent;
                    $scope.attendees = attendees; // Display attendees to screen
                })
                .catch (function(error) {
                    $log.warn(error);
                    growl.addErrorMessage("Something went wrong trying to get the list of Attendees");
                });                

           } else {
                $log.debug('User de-selected Event with EventID=' + $scope.selectedEvent.EventID);
                $scope.selectedEvent = selectedEvent;
                return;
            }
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
                growl.addErrorMessage("Something went wrong trying to get the list of yieldto.me Events");
            });
        })();
    }
]);
