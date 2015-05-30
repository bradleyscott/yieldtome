'use strict';

angular.module('yieldtome.controllers')

.controller('CreateAttendee', ['$scope', '$location', '$log', '$window', 'growl', 'SessionService', 'AttendeeService',
    function($scope, $location, $log, $window, growl, SessionService, AttendeeService) {

        $log.debug("CreateAttendee controller executing");

        $scope.title = 'Select a delegation';
        $scope.alternatebutton = 'Cancel';
        $scope.event;
        $scope.profile;
        $scope.selectedAttendee = { Name: '' }; // The Attendee record, including its Name
        $scope.availableAttendees; 

        $scope.$back = function() {
            $window.history.back();
        };
        
        // Redirects to the View Profile page
        $scope.showProfile = function(profileID) {
            if(profileID != null && profileID != 0) {
                $log.debug('Redirecting to View profile ' + profileID);
                $location.path("/viewProfile/" + profileID);
            }
        };

        $scope.attendAs = function(attendee) {
            $log.debug('AttendController.attendAs() starting');

            attendee.Profile = $scope.profile;
            var promise = AttendeeService.updateAttendee(attendee);

            promise.then(function(attendee) { // It all went well
                SessionService.set('attendee', attendee); // Saves the Attendee record in session
                growl.addInfoMessage('You are now attending ' + $scope.event.Name); 
                $location.path('/attendees'); // Redirect
            })
            .catch (function(error) { // The service crapped out
                $log.warn(error);
                growl.addErrorMessage("Something went wrong trying to attend this Event. " + error);
            });
        };

        $scope.save = function()
        {
            $log.debug('AttendController.save() starting');
            var promise = AttendeeService.attendEvent($scope.event, $scope.selectedAttendee.Name, $scope.profile);

            promise.then(function(attendee) { // It all went well
                SessionService.set('attendee', attendee); // Saves the Attendee record in session
                growl.addInfoMessage('You are now attending ' + $scope.event.Name); 
                $location.path('/attendees'); // Redirect
            })
            .catch (function(error) { // The service crapped out
                $log.warn(error);
                growl.addErrorMessage("Something went wrong trying to attend this Event. " + error);
            });
        };

        // Controller initialization
        (function() {
            $scope.profile = SessionService.get('profile');
            $scope.event = SessionService.get('event');

            if ($scope.profile == "undefined" || $scope.event == "undefined") {
                growl.addErrorMessage("We don't have enough information to have you attend this event");
            }

            // Get Available Attendees
            AttendeeService.getAttendees($scope.event).then(function(attendees) {
                    $scope.availableAttendees = _.where(attendees, {
                        Profile: null
                    });
                    $log.debug($scope.availableAttendees.length + ' available delegations');
                })
                .catch(function(error) {
                    $log.warn(error);
                    growl.addErrorMessage("Something went wrong trying to get the list of available delegations");
                });
        })();
    }
]);
