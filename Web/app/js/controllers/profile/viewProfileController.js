'use strict';

angular.module('yieldtome.controllers')

.controller('ViewProfile', ['$scope', '$log', '$window', '$routeParams', 'growl', 'ProfileService', 'SessionService',
    function($scope, $log, $window, $routeParams, growl, ProfileService, SessionService) {

        $log.debug("ViewProfile controller executing");

        $scope.title = 'View Profile';
        $scope.alternatebutton = 'Back';
        $scope.profile; // The profile to view
        $scope.thisUserProfile; // THe profile of this user
        $scope.formDisabled = true;

        $scope.$back = function() {
            $window.history.back();
        };

        // Controller initialization
        (function() {
            $scope.thisUserProfile = SessionService.get('profile');
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
