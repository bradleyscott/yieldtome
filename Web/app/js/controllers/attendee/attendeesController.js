'use strict';

angular.module('yieldtome.controllers')

.controller('Attendees', ['$scope', '$log', '$location', 'growl', 'SessionService', 'AttendeeService',
    function($scope, $log, $location, growl, SessionService, AttendeeService) {

        $log.debug("Landing controller executing");

        $scope.event;
        $scope.profile;
        $scope.attendee;
        $scope.attendees; // List of Attendees for this Event
        $scope.isCreator = false; // Indicates whether or not the user has edit right to 

        // Redirects to the View Profile page
        $scope.showProfile = function(profileID) {
            if(profileID != null && profileID != 0) {
                $log.debug('Redirecting to View profile ' + profileID);
                $location.path("/viewProfile/" + profileID);
            }
        };

        $scope.editAttendee = function(attendeeID) {
            if(attendeeID != null && attendeeID != 0) {
                $log.debug('Redirecting to Edit Attendee ' + attendeeID);
                $location.path("/editAttendee/" + attendeeID);
            }
        };

        // Controller initialization
        (function() {
            $scope.profile = SessionService.get('profile');
            $scope.event = SessionService.get('event');
            $scope.attendee = SessionService.get('attendee');

            // Display an error if you don't have the right event
            if($scope.event == 'undefined' || $scope.event == undefined)
            { 
                growl.addErrorMessage("We don't know what Event you're attending");
                return; 
            }

            // Set the creator flag
            if($scope.event.CreatorID == $scope.profile.ProfileID) {
                $scope.isCreator = true;
            }

            // Get Event Attendees
            var attendeesPromise = AttendeeService.getAttendees($scope.event);

            attendeesPromise.then(function(attendees) {
                for (var i = 0; i < attendees.length; i++) {
                    if (attendees[i].AttendeeID == $scope.attendee.AttendeeID) {
                        var attendeeIndex = attendees.indexOf(attendees[i]);
                        attendees.splice(attendeeIndex, 1);
                    }
                }

                $scope.attendees = attendees;
                $log.debug($scope.attendees.length + ' Attendees who are not this user');
            })
            .catch (function(error) {
                $log.warn(error);
                growl.addErrorMessage("Something went wrong trying to get the list of Attendees");
            });                
        })();

    }
]);
