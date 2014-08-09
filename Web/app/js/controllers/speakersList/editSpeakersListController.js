'use strict';

angular.module('yieldtome.controllers')

.controller('EditSpeakersList', ['$scope', '$location', '$log', '$window', '$modal', '$routeParams', 'growl', 'SessionService', 'SpeakersListService',
    function($scope, $location, $log, $window, $modal, $routeParams, growl, SessionService, SpeakersListService) {

        $log.debug("EditSpeakersList controller executing");

        $scope.title = 'Edit Speakers List';
        $scope.alternatebutton = 'Back';
        $scope.event;
        $scope.profile;
        $scope.list;
        $scope.isDeleteEnabled = true; // Enables the Delete button

        $scope.$back = function() {
            $window.history.back();
        };

        // Opens the delete list event modal
        $scope.showDelete = function() {
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
                $log.debug('Speakers List deleted after deleteList()');
                growl.addInfoMessage($scope.list.Name + " deleted");
                $location.path('/speakersLists');
            })            
            .catch (function(error) {
                $log.warn(error);
                growl.addErrorMessage("Something went wrong trying to delete this Speakers List");
            });                
        };

        $scope.save = function() // Edit Poll
        {
            $log.debug('EditPoll.save() starting');

            var promise = SpeakersListService.updateList($scope.list);

            promise.then(function(list) { // It all went well 
                $scope.list = list;
                growl.addInfoMessage('You successfully renamed ' + list.Name);
                $location.path('/speakersLists'); // Redirect
            })
            .catch (function(error) { // The service crapped out
                $log.warn(error);
                growl.addErrorMessage("Something went wrong trying to rename this Speakers List. " + error);
            });
        };

        // Controller initialization
        (function() {
            $scope.profile = SessionService.get('profile');
            $scope.event = SessionService.get('event');
            $scope.attendee = SessionService.get('attendee');

            var listID = $routeParams.speakersListID;
            var promise = SpeakersListService.getList(listID);

            promise.then(function(list) {
                $scope.list = list;
            })
            .catch (function(error) {
                $log.warn(error);
                growl.addErrorMessage("Something went wrong trying to get this Speakers List");
            });
        })();
}]);
