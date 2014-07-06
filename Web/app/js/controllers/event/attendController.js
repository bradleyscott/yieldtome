'use strict';

angular.module('yieldtome.controllers')

.controller('Attend', ['$scope', '$location', '$log', '$window', 'SessionService', 'AttendeeService',
    function($scope, $location, $log, $window, SessionService, AttendeeService) {

        $log.debug("Attend controller executing");

        $scope.error; // An error message that will be displayed to screen
        $scope.info; // An info message that will be displayed to screen
        $scope.event;
        $scope.profile;
        $scope.name; // The Attendee name

        $scope.$back = function() {
            $window.history.back();
        };

        $scope.save = function()
        {
            $log.debug('AttendController.save() starting');
            var promise = AttendeeService.attendEvent($scope.event, $scope.name, $scope.profile);

            promise.then(function(attendee) // It all went well
                {
                    SessionService.set('attendee', attendee); // Saves the Attendee record in session
                    $scope.info = 'You are now attending ' + $scope.event.Name; 
                    $location.path('/landing'); // Redirect
                })
            .catch (function(error) { // The service crapped out
                $scope.error = "Something wen't wrong trying to attend this Event. " + error.Message;
            });
        };

        // Controller initialization
        (function() {

            $scope.profile = SessionService.get('profile');
            $scope.event = SessionService.get('event');

            if ($scope.profile == "undefined" || $scope.event == "undefined") {
                $scope.error = "We don't have enough information to have you attend this event";
            }
        })();

    }
]);
