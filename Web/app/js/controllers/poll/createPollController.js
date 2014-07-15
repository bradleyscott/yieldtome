'use strict';

angular.module('yieldtome.controllers')

.controller('CreatePoll', ['$scope', '$location', '$log', '$window', 'SessionService', 'PollService',
    function($scope, $location, $log, $window, SessionService, PollService) {

        $log.debug("CreatePoll controller executing");

        $scope.title = 'Create Poll';
        $scope.alternatebutton = 'Cancel';
        $scope.error; // An error message that will be displayed to screen
        $scope.info; // An info message that will be displayed to screen
        $scope.event;
        $scope.profile;
        $scope.poll = { Name: 'New Poll', MajorityRequired:50 }; // The Poll to be created
        $scope.ignoreAbstain = true; // Infers the Poll type

        $scope.$back = function() {
            $window.history.back();
        };

        $scope.save = function()
        {
            $log.debug('CreatePoll.save() starting');

            // Save Poll
            var promise = PollService.createPoll($scope.event, $scope.poll, !$scope.ignoreAbstain);

            promise.then(function(poll) // It all went well
                {
                    $scope.info = 'You have created  ' + poll.Name; 
                    $location.path('/polls'); // Redirect
                })
            .catch (function(error) { // The service crapped out
                $scope.error = "Something went wrong trying to create this Poll. " + error.Message;
            });
        };

        // Controller initialization
        (function() {

            $scope.profile = SessionService.get('profile');
            $scope.event = SessionService.get('event');

            if ($scope.profile == "undefined" || $scope.event == "undefined") {
                $scope.error = "We don't have enough information to have you create a Poll";
            }

            $scope.poll.CreatorID = $scope.profile.ProfileID; // Set the Poll creator
        })();

    }
]);