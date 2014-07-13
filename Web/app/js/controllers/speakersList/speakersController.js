'use strict';

/* Controllers */

angular.module('yieldtome.controllers')

.controller('Speakers', ['$scope', '$location', '$log', '$window', '$modal', '$routeParams', 'SessionService', 'SpeakersListService',
    function($scope, $location, $log, $window, $modal, $routeParams, SessionService, SpeakersListService) {

        $log.debug("Speakers controller executing");

        $scope.error; // An error message that will be displayed to screen
        $scope.info; // An info message that will be displayed to screen
        $scope.profile; // The authenticated Profile, if it exists
        $scope.event; // Selected Event
        $scope.attendee; // Attendee record for this Profile
        $scope.list; // The Speakers List
        $scope.speakers; // The Speakers for the list
        $scope.speakingSlot; // The Speaker record for this Attendee
        
        $scope.$back = function() {
            $window.history.back();
        };

        $scope.toggleCarousel = function() {
            $scope.isCarouselVisible = !$scope.isCarouselVisible;
        };

        // Opens the delete list event modal
        $scope.showDeleteList = function() {
            $scope.deleteConfirm = $modal.open({ 
                templateUrl: 'partials/speakersList/deleteList.html',
                scope: $scope
            }); 

            $scope.deleteConfirm.result.then(function() { // Respond if user clicks delete
                $scope.deleteList();
            },
            function(){ // Respond if user cancels the delete
                $log.debug('User cancelled SpeakersList delete');
            });
        };

        // Is called when the delete button is clicked on the modal
        $scope.confirmDelete = function() {
            $scope.deleteConfirm.close();
        };

        // Is called when the cancel or 'x' buttons are clicked on the modal 
        $scope.cancelDelete = function() {
            $scope.deleteConfirm.dismiss();
        };

        // Delete the Speakers list
        $scope.deleteList = function()
        {
            $log.debug('SpeakersController.deleteList() executing');
            var promise = SpeakersListService.deleteList($scope.list);

            promise.then(function(data) {
                $scope.info = $scope.list.Name + " deleted";
                $log.debug('Speakers List deleted after deleteList()');
                $location.path('/speakersLists');
            })            
            .catch (function(error) {
                $log.warn(error);
                $scope.error = "Something went wrong trying to delete this Speakers List";
            });                
        };

        // Adds to the Speakers list
        $scope.add = function(position) {
            $log.debug('SpeakersController.add() executing');

            var promise = SpeakersListService.createSpeaker($scope.list, $scope.attendee, position);

            promise.then(function(speaker) {
                $scope.info = "You have been added to the Speakers List";
                $scope.getSpeakers();
            })            
            .catch (function(error) {
                $log.warn(error);
                $scope.error = "Something went wrong trying to add you to the Speakers List";
            });                
        };

        // Opens the Speakers list to more speakers
        $scope.openList = function() {
            $log.debug('SpeakersController.openList() executing');

            $scope.list.Status = 'Open';
            var promise = SpeakersListService.updateList($scope.list);

            promise.then(function(list) {
                $scope.list = list;
                $scope.info = list.Name + " opened to new Speakers";
                $log.debug('$scope.list updated after openList()');
            })            
            .catch (function(error) {
                $log.warn(error);
                $scope.error = "Something went wrong trying to open " + $scope.list.Name + " to new Speakers";
            });                
        };

        // Closes the Speakers list to more speakers
        $scope.closeList = function() {
            $log.debug('SpeakersController.closeList() executing');

            $scope.list.Status = 'Closed';
            var promise = SpeakersListService.updateList($scope.list);

            promise.then(function(list) {
                $scope.list = list;
                $scope.info = list.Name + " closed to new Speakers";
                $log.debug('$scope.list updated after closeList()');
            })            
            .catch (function(error) {
                $log.warn(error);
                $scope.error = "Something went wrong trying to close " + $scope.list.Name + " to new Speakers";
            });                
        };

        // Clears all the Speakers from the Speakers list
        $scope.removeAllSpeakers = function() {
            $log.debug('SpeakersController.removeAllSpeakers() executing');
            var promise = SpeakersListService.deleteAllSpeakers($scope.list);

            promise.then(function(speakers) {
                $scope.speakers = speakers;
                $scope.info = "Speakers have all been removed";
                $log.debug('$scope.speakers updated after removeAllSpeakers()');
            })            
            .catch (function(error) {
                $log.warn(error);
                $scope.error = "Something went wrong trying to remove the Speakers from this Speakers list";
            });                
        };

        // Remove a speaker from the list
        $scope.remove = function(speaker)
        {
            $log.debug('SpeakersController.remove() executing');
            var promise = SpeakersListService.deleteSpeaker(speaker);

            promise.then(function(speakers) {
                $scope.speakers = speakers;
                $scope.info = speaker.Attendee.Name + " removed";
                $log.debug('$scope.speakers updated after remove()');
            })            
            .catch (function(error) {
                $log.warn(error);
                $scope.error = "Something went wrong trying to remove this Speaker";
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
            })            
            .catch (function(error) {
                $log.warn(error);
                $scope.error = "Something went wrong trying to re-order the Speakers list";
            }); 
        };

        // Mark a Speaker as having spoken
        $scope.speak = function(speaker) {
            $log.debug('SpeakersController.speak() executing');
            var promise = SpeakersListService.speakerHasSpoken(speaker);

            promise.then(function(speakers) {
                $scope.speakers = speakers;
                $scope.info = speaker.Attendee.Name + " has now spoken and has been removed";
                $log.debug('$scope.speakers updated after speak()');
            })            
            .catch (function(error) {
                $log.warn(error);
                $scope.error = "Something went wrong trying to update the Speakers list";
            });                
        };

        // Retrieves the Speakers on the list
        $scope.getSpeakers = function() {
            $log.debug('SpeakersController.getSpeakers() executing');
            var promise = SpeakersListService.getSpeakers($scope.list);

            promise.then(function(speakers) {
                $scope.speakers = speakers;
            })            
            .catch (function(error) {
                $log.warn(error);
                $scope.error = "Something went wrong trying to get the list of Speakers";
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
                $scope.error = "Something went wrong trying to get this Speakers List";
            });                

        })();

        // Watch and log $scope.speakers changes
        $scope.$watch("speakers", function(speakers) {
            $log.debug('Speakers changed in scope');

            // See if this Attendee is a speaker
            $scope.speakingSlot = null;
            angular.forEach($scope.speakers, function(value, key){
                if(value.Attendee ? (value.Attendee.AttendeeID == $scope.attendee.AttendeeID) : false) {
                    $scope.speakingSlot = value;
                }
            });
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
