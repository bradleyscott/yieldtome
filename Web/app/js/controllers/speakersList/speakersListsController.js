'use strict';

/* Controllers */

angular.module('yieldtome.controllers')

.controller('SpeakersLists', ['$scope', '$location', '$log', '$window', 'SessionService', 'SpeakersListService',
    function($scope, $location, $log, $window, SessionService, SpeakersListService) {

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

        $scope.new = function() {
            $log.debug('User clicked the New SpeakersList button');
            $location.path('/createSpeakersList');
        };

        // Controller initialize
        (function() {
            $log.debug('Retrieving SpeakersLists to create model');

            // Allocate the saved Profile to the controller
            $scope.profile = SessionService.get('profile');
            $scope.event = SessionService.get('event');
            $scope.attendee = SessionService.get('attendee');

            // Display an error if you don't have the right event
            if($scope.event == 'undefined' || $scope.event == undefined)
            { 
                $scope.error = "We don't know what Event you're attending";
                return; 
            }
            
            var promise = SpeakersListService.getLists($scope.event);

            promise.then(function(lists) {
                $scope.lists = lists;
            })
            .catch (function(error) {
                $log.warn(error);
                $scope.error = "Something wen't wrong trying to get the list of Speakers Lists";
            });                

        })();
    }
]);
