'use strict';

angular.module('yieldtome.controllers')

.controller('EditProfile', ['$scope', '$location', '$log', '$window', 'growl', 'SessionService', 'ProfileService',
    function($scope, $location, $log, $window, growl, SessionService, ProfileService) {

        $log.debug("EditProfile controller executing");

        $scope.title = 'Edit Profile';
        $scope.alternatebutton = 'Back';
        $scope.profile;

        $scope.$back = function() {
            $window.history.back();
        };

        $scope.save = function() // Edit Profile
        {
            $log.debug('EditProfile.save() starting');
            var promise = ProfileService.editProfile($scope.profile);

            promise.then(function(profile) { // It all went well
                SessionService.set('profile', profile); // Saves the profile in session
                growl.addInfoMessage('Your Profile updates just got saved');
                $scope.$back(); // Return to previous page
            })
            .catch (function(error) { // The service crapped out
                $log.warn(error);
                growl.addErrorMessage("Something went wrong trying to edit your Profile");
            });
        };

        // Controller initialization
        (function() {
            // Allocate the saved Profile to the controller
            $scope.profile = SessionService.get('profile');
        })();

    }
]);
