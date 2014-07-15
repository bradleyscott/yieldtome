'use strict';

angular.module('yieldtome.controllers')

.controller('EditPoll', ['$scope', '$location', '$log', '$window', '$modal', '$routeParams', 'SessionService', 'PollService',
    function($scope, $location, $log, $window, $modal, $routeParams, SessionService, PollService) {

        $log.debug("EditPoll controller executing");

        $scope.title = 'Edit Poll';
        $scope.alternatebutton = 'Back';
        $scope.error; // An error message that will be displayed to screen
        $scope.info; // An info message that will be displayed to screen
        $scope.poll;
        $scope.profile;
        $scope.isDeleteEnabled = true; // Enables the Delete button
        $scope.deleteConfirm; // Delete confirmation dialog promise

        $scope.$back = function() {
            $window.history.back();
        };

        // Opens the delete event modal
        $scope.showDelete = function() {
            $scope.deleteConfirm = $modal.open({ 
                templateUrl: 'partials/event/deletePoll.html',
                scope: $scope
            }); 

            $scope.deleteConfirm.result.then(function() { // Respond if user clicks delete
                $scope.delete();
            },
            function(){ // Respond if user cancels the delete
                $log.debug('User cancelled Event delete');
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

        $scope.delete = function() {
            $log.debug('EditPoll.delete() starting');
            $scope.error = '';

            var promise = PollService.deletePoll($scope.event);

            promise.then(function(data) // It all went well
                {
                    $scope.info = 'You just deleted ' + $scope.poll.Name;
                    $location.path('/polls'); // Redirect to events page
                })
            .catch (function(error) { // The service crapped out
                $scope.error = "Something went wrong trying to delete your Poll. " + error;
            });
        };

        $scope.save = function() // Edit Poll
        {
            $log.debug('EditPoll.save() starting');
            $scope.error = '';

            var promise = PollService.updatePoll($scope.poll);

            promise.then(function(poll) { // It all went well 
                $scope.poll = poll;  
                $scope.info = 'Your Poll updates just got saved';
            })
            .catch (function(error) { // The service crapped out
                $scope.error = "Something went wrong trying to edit your Poll. " + error;
            });
        };

        // Controller initialization
        (function() {
            // Allocate the saved Profile to the controller
            $scope.profile = SessionService.get('profile');

            var pollID = $routeParams.pollID;
            var promise = PollService.getPoll(pollID);

            promise.then(function(poll) {
                $scope.poll = poll;
            })
            .catch (function(error) {
                $log.warn(error);
                $scope.error = "Something went wrong trying to get this Poll";
            });
        })();

    }
]);
