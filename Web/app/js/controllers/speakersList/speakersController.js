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

        // Remove a speaker from the list
        $scope.remove = function(speaker)
        {
            $log.debug('SpeakersController.remove() executing');
            var promise = SpeakersListService.deleteSpeaker(speaker);

            promise.then(function(speakers) {
                $scope.speakers = speakers;
                $scope.info = "Speaker removed";
                $log.debug('$scope.speakers updated after remove()');
            })            
            .catch (function(error) {
                $log.warn(error);
                $scope.error = "Something wen't wrong trying to remove this Speaker";
            });                
        };

        // Update the order of the speakers
        $scope.reorderSpeakers= function() {
            $log.debug('SpeakersController.reorderSpeakers() executing');
            var promise = SpeakersListService.reorderSpeakers($scope.list, $scope.speakers);

            promise.then(function(speakers) {
                $scope.speakers = speakers;
                $scope.info = "Speakers list re-ordered";
                $log.debug('$scope.speakers updated after reorderSpeakers()');
                
                $('.carousel').carousel('next'); // ugly hack to get carousel working again after update
            })            
            .catch (function(error) {
                $log.warn(error);
                $scope.error = "Something wen't wrong trying to re-order the Speakers list";
            }); 
        };

        // Mark a Speaker as having spoken
        $scope.speak = function(speaker) {
            $log.debug('SpeakersController.speak() executing');
            var promise = SpeakersListService.speakerHasSpoken(speaker);

            promise.then(function(speakers) {
                $scope.speakers = speakers;
                $scope.info = "Speaker has now spoken and has been removed";
                $log.debug('$scope.speakers updated after speak()');
            })            
            .catch (function(error) {
                $log.warn(error);
                $scope.error = "Something wen't wrong trying to update the Speakers list";
            });                
        };

        $scope.getSpeakers = function() {
            $log.debug('SpeakersController.getSpeakers() executing');
            var promise = SpeakersListService.getSpeakers($scope.list);

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
                $scope.getSpeakers(); // Get Speakers
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

        // Speakers order is changed through a drag and drop
        $scope.speakerReorder = {
            update: function(e, ui) { 
                $log.debug('Speakers order changed on UI'); 
                $scope.reorderSpeakers(); 
            }
        };

    }
]);
