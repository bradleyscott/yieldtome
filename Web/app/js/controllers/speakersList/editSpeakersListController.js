'use strict';

angular.module('yieldtome.controllers')

.controller('EditSpeakersList', ['$scope', '$location', '$log', '$window', '$routeParams', 'growl', 'SessionService', 'SpeakersListService',
    function($scope, $location, $log, $window, $routeParams, growl, SessionService, SpeakersListService) {

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
