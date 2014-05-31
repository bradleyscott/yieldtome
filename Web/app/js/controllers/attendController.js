'use strict';

angular.module('yieldtome.controllers')

.controller('Attend', ['$scope', '$location', '$log', '$window',
    function($scope, $location, $log, $window) {

        $log.debug("Attend controller executing");

        $scope.error; // An error message that will be displayed to screen
        $scope.info; // An info message that will be displayed to screen
        $scope.event;
        $scope.profile;
        $scope.name; // The Attendee name

        $scope.$back = function() {
            $window.history.back();
        };

        // Controller initialization
        (function() {

            // Allocate the saved Profile and Event to the controller
            if ($window.sessionStorage.profile != "undefined" && $window.sessionStorage.event != "undefined") {
                $scope.profile = JSON.parse($window.sessionStorage.profile);
                $scope.event = JSON.parse($window.sessionStorage.event);
            }
            else {
                $scope.error = "We don't have enough information to have you attend this event";
            }

        })();

    }
]);
