'use strict';

angular.module('yieldtome.controllers')

.controller('EditProfile', ['$scope', '$location', '$log', '$window', 'ProfileService',
    function($scope, $location, $log, $window, ProfileService) {

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
                    $window.sessionStorage.profile = JSON.stringify(profile); // Saves the profile in session
                    $scope.info = 'Your Profile updates just got saved'; // Redirect to the previous page
                })
            .catch (function(error) { // The service crapped out
                $scope.error = "Something wen't wrong trying to edit your Profile";
            });
        };

        // Controller initialization
        (function() {

            // Allocate the saved Profile to the controller
            if($window.sessionStorage.profile != "undefined")
            { $scope.profile = JSON.parse($window.sessionStorage.profile); }

        })();

    }
]);
