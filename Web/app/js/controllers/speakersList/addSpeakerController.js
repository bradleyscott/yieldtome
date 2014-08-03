'use strict';

/* Controllers */

angular.module('yieldtome.controllers')

.controller('AddSpeaker', ['$scope', '$location', '$log', '$window', '$routeParams', 'growl', 'SessionService', 'SpeakersListService', 'SpeakersService', 'AttendeeService',
    function($scope, $location, $log, $window, $routeParams, growl, SessionService, SpeakersListService, SpeakersService, AttendeeService) {

        $log.debug("Speakers controller executing");

        $scope.profile; // The authenticated Profile, if it exists
        $scope.event; // Selected Event
        $scope.attendees; // List of Attendees for this Event
        $scope.list; // The Speakers List

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

        // Adds to the Speakers list
        $scope.add = function(attendee, position) {
            $log.debug('SpeakersController.add() executing');

            var promise = SpeakersService.createSpeaker($scope.list, attendee, position);

            promise.then(function(speaker) {
                var message = attendee.Name + " has been added to the Speakers List";
                if(position != 'None') { message = message + " speaking " + position; }
                growl.addInfoMessage(message);

                $location.path("/speakers/" + $scope.list.SpeakersListID);
            })            
            .catch (function(error) {
                $log.warn(error);
                growl.addErrorMessage("Something went wrong trying to add you to the Speakers List");
            });                
        };

        // Controller initialize
        (function() {
            $log.debug('Retrieving Attendees and SpeakersList to create model');

            // Allocate the saved Profile et al to the controller
            $scope.profile = SessionService.get('profile');
            $scope.event = SessionService.get('event');

            // Get the Speakers List
            var speakersListID = $routeParams.speakersListID;
            var listPromise = SpeakersListService.getList(speakersListID);

            listPromise.then(function(list) {
                $scope.list = list;
            })
            .catch (function(error) {
                $log.warn(error);
                growl.addErrorMessage("Something went wrong trying to get this Speakers List");
            });                

            // Get Event Attendees
            var attendeesPromise = AttendeeService.getAttendees($scope.event);

            attendeesPromise.then(function(attendees) {
                $scope.attendees = attendees;
            })
            .catch (function(error) {
                $log.warn(error);
                growl.addErrorMessage("Something went wrong trying to get the list of Attendees");
            });                

        })();
    }
]);
