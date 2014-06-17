'use strict';

angular.module('yieldtome.controllers')

.controller('Landing', ['$scope', '$log', 'SessionService',
    function($scope, $log, SessionService) {

        $log.debug("Landing controller executing");

        $scope.error; // An error message that will be displayed to screen
        $scope.info; // An info message that will be displayed to screen
        $scope.event;
        $scope.profile;
        $scope.attendee;

        $scope.$back = function() {
            $window.history.back();
        };

        // Controller initialization
        (function() {
            $scope.profile = SessionService.get('profile');
            $scope.event = SessionService.get('event');
            $scope.attendee = SessionService.get('attendee');
        })();

    }
]);
