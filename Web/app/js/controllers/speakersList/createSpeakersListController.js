'use strict';

angular.module('yieldtome.controllers')

.controller('CreateSpeakersList', ['$scope', '$location', '$log', '$window', 'growl', 'SessionService', 'SpeakersListService',
    function($scope, $location, $log, $window, growl, SessionService, SpeakersListService) {

        $log.debug("CreateSpeakersList controller executing");

        $scope.title = "Create Speakers list";
        $scope.alternatebutton = 'Cancel';
        $scope.event;
        $scope.profile;
        $scope.list = { Name:"" }; // The Speakers list

        $scope.$back = function() {
            $window.history.back();
        };

        $scope.save = function()
        {
            $log.debug('CreateSpeakersList.save() starting');

            // Create a new SpeakersList object
            var newList = {
                Name: $scope.list.Name,
                CreatorID: $scope.profile.ProfileID
            };

            // Save SpeakersList object
            var promise = SpeakersListService.createList($scope.event, newList);

            promise.then(function(list) { // It all went well
                growl.addInfoMessage('You have created  ' + list.Name); 
                $location.path('/speakersLists'); // Redirect
            })
            .catch (function(error) { // The service crapped out
                $log.warn(error);
                growl.addErrorMessage("Something went wrong trying to create this Speakers List. " + error);
            });
        };

        // Controller initialization
        (function() {

            $scope.profile = SessionService.get('profile');
            $scope.event = SessionService.get('event');
            $scope.attendee = SessionService.get('attendee');

            if ($scope.profile == "undefined" || $scope.event == "undefined") {
                growl.addErrorMessage("We don't have enough information to have you create a Speakers list");
            }
        })();

    }
]);
