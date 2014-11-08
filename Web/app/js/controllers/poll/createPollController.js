'use strict';

angular.module('yieldtome.controllers')

.controller('CreatePoll', ['$scope', '$location', '$log', '$window', 'growl', 'SessionService', 'PollService',
    function($scope, $location, $log, $window, growl, SessionService, PollService) {

        $log.debug("CreatePoll controller executing");

        $scope.title = 'Create Poll';
        $scope.alternatebutton = 'Cancel';
        $scope.event;
        $scope.profile;
        $scope.poll = { Name: 'New Poll', MajorityRequired:50 }; // The Poll to be created
        $scope.ignoreAbstain = "true"; // Infers the Poll type

        $scope.$back = function() {
            $window.history.back();
        };

        $scope.save = function()
        {
            $log.debug('CreatePoll.save() starting');

            // Save Poll
            var ignoreAbstain = $scope.ignoreAbstain == "true";
            var promise = PollService.createPoll($scope.event, $scope.poll, !ignoreAbstain);

            promise.then(function(poll) { // It all went well
                growl.addInfoMessage('You have created  ' + poll.Name); 
                $location.path('/polls'); // Redirect
            })
            .catch (function(error) { // The service crapped out
                $log.warn(error);
                growl.addErrorMessage("Something went wrong trying to create this Poll. " + error);
            });
        };

        // Controller initialization
        (function() {

            $scope.profile = SessionService.get('profile');
            $scope.event = SessionService.get('event');
            $scope.attendee = SessionService.get('attendee');

            if ($scope.profile == null || $scope.event == null) {
                growl.addErrorMessage("We don't have enough information to have you create a Poll");
                return;
            }
        
            $scope.poll.CreatorID = $scope.profile.ProfileID; // Set the Poll creator              
        })();

    }
]);
