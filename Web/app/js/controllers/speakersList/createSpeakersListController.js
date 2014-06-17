'use strict';

angular.module('yieldtome.controllers')

.controller('CreateSpeakersList', ['$scope', '$location', '$log', '$window', 'SessionService', 'SpeakersListService',
    function($scope, $location, $log, $window, SessionService, SpeakersListService) {

        $log.debug("CreateSpeakersList controller executing");

        $scope.title = "Create Speakers list";
        $scope.error; // An error message that will be displayed to screen
        $scope.info; // An info message that will be displayed to screen
        $scope.event;
        $scope.profile;
        $scope.name; // The Speakers list name

        $scope.$back = function() {
            $window.history.back();
        };

        $scope.save = function()
        {
            $log.debug('CreateSpeakersList.save() starting');

            // Create a new SpeakersList object
            var newList = {
                Name: $scope.name,
                CreatorID: $scope.profile.ProfileID
            };

            // Save SpeakersList object
            var promise = SpeakersListService.createList($scope.event, newList);

            promise.then(function(list) // It all went well
                {
                    $scope.info = 'You have created  ' + list.Name; 
                    $location.path('/speakersLists'); // Redirect
                })
            .catch (function(error) { // The service crapped out
                $scope.error = "Something wen't wrong trying to create this Speakers List. " + error.Message;
            });
        };

        // Controller initialization
        (function() {

            $scope.profile = SessionService.get('profile');
            $scope.event = SessionService.get('event');

            if ($scope.profile == "undefined" || $scope.event == "undefined") {
                $scope.error = "We don't have enough information to have you create a Speakers list";
            }
        })();

    }
]);
