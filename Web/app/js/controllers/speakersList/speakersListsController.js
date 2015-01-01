'use strict';

/* Controllers */

angular.module('yieldtome.controllers')

.controller('SpeakersLists', ['$scope', '$location', '$log', '$window', 'growl', 'SessionService', 'SpeakersListService',
    function($scope, $location, $log, $window, growl, SessionService, SpeakersListService) {

        $log.debug("Speakers controller executing");

        $scope.profile; // The authenticated Profile, if it exists
        $scope.event; // Selected Event
        $scope.attendee; // Attendee record for this Profile
        $scope.lists; // All the Speakers lists for the Event

        $scope.$back = function() {
            $window.history.back();
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
                growl.addErrorMessage("We don't know what Event you're attending");
                return; 
            }
            
            var promise = SpeakersListService.getLists($scope.event);

            promise.then(function(lists) {
                $scope.lists = lists;
            })
            .catch (function(error) {
                $log.warn(error);
                growl.addErrorMessage("Something went wrong trying to get the list of Speakers Lists");
            });                

        })();
    }
]);
