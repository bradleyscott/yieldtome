'use strict';

/* Controllers */

angular.module('yieldtome.controllers')

.controller('Speakers', ['$scope', '$location', '$log', '$window', '$routeParams', 'SessionService', 'SpeakersListService',
    function($scope, $location, $log, $window, $routeParams, SessionService, SpeakersListService) {

        $log.debug("Speakers controller executing");

        $scope.error; // An error message that will be displayed to screen
        $scope.info; // An info message that will be displayed to screen
        $scope.profile; // The authenticated Profile, if it exists
        $scope.event; // Selected Event
        $scope.attendee; // Attendee record for this Profile
        $scope.list; // The Speakers List
        $scope.speakers; // The Speakers for the list
        $scope.isCarouselVisible = true;  // Determines whether the Carousel or List is visible

        $scope.$back = function() {
            $window.history.back();
        };

        $scope.toggleCarousel = function() {
            $scope.isCarouselVisible = !$scope.isCarouselVisible;
        };

        // Mark a Speaker as having spoken
        $scope.speak = function(speaker) {

        };

        $scope.getSpeakers = function(list) {
            var promise = SpeakersListService.getSpeakers(list);

            promise.then(function(speakers) {
                $scope.speakers = speakers;
            })            
            .catch (function(error) {
                $log.warn(error);
                $scope.error = "Something wen't wrong trying to get the list of Speakers";
            });                
        };
        
        // Controller initialize
        (function() {
            $log.debug('Retrieving Speakers to create model');

            // Allocate the saved Profile et al to the controller
            $scope.profile = SessionService.get('profile');
            $scope.event = SessionService.get('event');
            $scope.attendee = SessionService.get('attendee');

            // Get the Speakers List
            var speakersListID = $routeParams.speakersListID;
            var promise = SpeakersListService.getList(speakersListID);

            promise.then(function(list) {
                $scope.list = list;
                $scope.getSpeakers(list); // Get Speakers
            })
            .catch (function(error) {
                $log.warn(error);
                $scope.error = "Something wen't wrong trying to get this Speakers List";
            });                

        })();

        // Watch and log $scope.speakers changes
        $scope.$watch("speakers", function(speakers) {
            $log.debug('Speakers changed in scope');
        });

        // Log when the Speakers order is changed through a drag and drop
        $scope.speakerReorder = {
            start: function(e, ui) { $log.debug('Drag start'); },
            activate: function(e, ui) { $log.debug('Drag activate'); },
            beforeStop: function(e, ui) { $log.debug('Drag beforeStop'); },
            update: function(e, ui) { $log.debug('Speakers order changed on UI'); },
            deactivate: function(e, ui) { $log.debug('Drag deactive'); },
            stop: function(e, ui) { $log.debug('Drag stop'); }
        };

    }
]);
