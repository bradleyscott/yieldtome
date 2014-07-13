'use strict';

angular.module('yieldtome.controllers')

.controller('EditProfile', ['$scope', '$location', '$log', '$window', 'SessionService', 'ProfileService',
    function($scope, $location, $log, $window, SessionService, ProfileService) {

        $log.debug("EditProfile controller executing");

        $scope.title = 'Edit Profile';
        $scope.alternatebutton = 'Back';
        $scope.error; // An error message that will be displayed to screen
        $scope.info; // An info message that will be displayed to screen
        $scope.profile;

        $scope.$back = function() {
            $window.history.back();
        };

        $scope.save = function() // Edit Profile
        {
            $log.debug('EditProfile.save() starting');
            var promise = ProfileService.editProfile($scope.profile);

            promise.then(function(profile) // It all went well
                {
                    SessionService.set('profile', profile); // Saves the profile in session
                    $scope.info = 'Your Profile updates just got saved';
                })
            .catch (function(error) { // The service crapped out
                $scope.error = "Something went wrong trying to edit your Profile";
            });
        };

        // Controller initialization
        (function() {

            // Allocate the saved Profile to the controller
            $scope.profile = SessionService.get('profile');

        })();

    }
]);
