'use strict';

angular.module('yieldtome.controllers')

.controller('Landing', ['$scope', '$log', 'SessionService',
    function($scope, $log, SessionService) {

        $log.debug("Landing controller executing");

        $scope.event;
        $scope.profile;
        $scope.attendee;

        // Controller initialization
        (function() {
            $scope.profile = SessionService.get('profile');
            $scope.event = SessionService.get('event');
            $scope.attendee = SessionService.get('attendee');
        })();

    }
]);
