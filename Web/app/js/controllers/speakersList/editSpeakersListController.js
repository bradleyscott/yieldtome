'use strict';

angular.module('yieldtome.controllers')

.controller('EditSpeakersList', ['$scope', '$location', '$log', '$window', '$routeParams', 'SessionService', 'SpeakersListService',
    function($scope, $location, $log, $window, $routeParams, SessionService, SpeakersListService) {

        $log.debug("EditSpeakersList controller executing");

        $scope.title = 'Edit Speakers List';
        $scope.alternatebutton = 'Back';
        $scope.error; // An error message that will be displayed to screen
        $scope.info; // An info message that will be displayed to screen
        $scope.event;
        $scope.profile;
        $scope.list;
        $scope.isDeleteEnabled = true; // Enables the Delete button

        $scope.$back = function() {
            $window.history.back();
        };

        $scope.save = function() // Edit Poll
        {
            $log.debug('EditPoll.save() starting');
            $scope.error = '';

            var promise = SpeakersListService.updateList($scope.list);

            promise.then(function(list) { // It all went well 
                $scope.list = list;  
                $scope.info = 'You successfully renamed this Speakers List';
            })
            .catch (function(error) { // The service crapped out
                $scope.error = "Something went wrong trying to rename this Speakers List. " + error.Message;
            });
        };

        // Controller initialization
        (function() {
            $scope.profile = SessionService.get('profile');
            $scope.event = SessionService.get('event');

            var listID = $routeParams.speakersListID;
            var promise = SpeakersListService.getList(listID);

            promise.then(function(list) {
                $scope.list = list;
            })
            .catch (function(error) {
                $log.warn(error);
                $scope.error = "Something went wrong trying to get this Speakers List";
            });
        })();
}]);
