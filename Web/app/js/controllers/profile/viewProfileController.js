'use strict';

angular.module('yieldtome.controllers')

.controller('ViewProfile', ['$scope', '$log', '$window', '$routeParams', 'growl', 'ProfileService',
    function($scope, $log, $window, $routeParams, growl, ProfileService) {

        $log.debug("ViewProfile controller executing");

        $scope.title = 'View Profile';
        $scope.alternatebutton = 'Back';
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
                growl.addErrorMessage("Something went wrong trying to get this Profile");
            });

        })();

    }
]);
