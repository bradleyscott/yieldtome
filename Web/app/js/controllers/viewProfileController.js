'use strict';

angular.module('yieldtome.controllers')

.controller('ViewProfile', ['$scope', '$log', '$window', '$routeParams', 'ProfileService',
    function($scope, $log, $window, $routeParams, ProfileService) {

        $log.debug("ViewProfile controller executing");

        $scope.title = 'View Profile';
        $scope.alternatebutton = 'Back';
        $scope.error; // An error message that will be displayed to screen
        $scope.info; // An info message that will be displayed to screen
        $scope.profile;
        $scope.formDisabled = true;

        $scope.$back = function() {
            $window.history.back();
        };

        // Controller initialization
        (function() {

            var profileID = $routeParams.profileID;
            var promise = ProfileService.getProfile(profileID);

            promise.then(function(profile) {
                $scope.profile = profile;
            })
            .catch (function(error) {
                $log.warn(error);
                $scope.error = "Something wen't wrong trying to get this Profile";
            });

        })();

    }
]);
