'use strict';

/* Controllers */

angular.module('yieldtome.controllers')

.controller('Polls', ['$scope', '$location', '$log', '$window', 'growl', 'SessionService', 'PollService',
    function($scope, $location, $log, $window, growl, SessionService, PollService) {

        $log.debug("Polls controller executing");

        $scope.profile; // The authenticated Profile, if it exists
        $scope.event; // Selected Event
        $scope.attendee; // Attendee record for this Profile
        $scope.polls; // All the Polls for the Event

        $scope.$back = function() {
            $window.history.back();
        };

        $scope.new = function() {
            $log.debug('User clicked the New Poll button');
            $location.path('/createPoll');
        };

        // Controller initialize
        (function() {
            $log.debug('Retrieving Polls to create model');

            // Allocate the saved Profile to the controller
            $scope.profile = SessionService.get('profile');
            $scope.event = SessionService.get('event');
            $scope.attendee = SessionService.get('attendee');

            // Display an error if you don't have the right event
            if($scope.event == 'undefined' || $scope.event == undefined)
            { 
                growl.addErrorMessage("We don't know what Event you're attending");
                return; 
            }
            
            var promise = PollService.getPolls($scope.event);

            promise.then(function(polls) {
                $scope.polls = polls;
            })
            .catch (function(error) {
                $log.warn(error);
                growl.addErrorMessage("Something went wrong trying to get the list of Polls");
            });                

        })();
    }
]);
