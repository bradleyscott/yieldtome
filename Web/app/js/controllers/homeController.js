'use strict';

/* Controllers */

angular.module('yieldtome.controllers', [])

.controller('Home', ['$scope', '$location', '$log', '$window', 'AuthenticationService',
    function($scope, $location, $log, $window, AuthenticationService) {

        $log.debug("Home controller executing");

        $scope.error; // An error message that will be displayed to screen
        $scope.info; // An info message that will be displayed to screen

        $scope.login = function() { // Get an apiToken and try to get a profile

            $log.debug('HomeController.login() starting');
            $scope.error = ''; // Clear any saved errors

            var tokenPromise = AuthenticationService.getApiToken();
            tokenPromise.then(function(token) // Process the token
                {
                    if (token === null) // The user didn't authenticate
                    {
                        $scope.error = "We weren't able to login you in. Did you authorize our Facebook request?";
                        return;
                    }
                })
            .catch (function(error) {
                $scope.error = "We weren't able to login you in. Did you authorize our Facebook request?";
                return;
            })
            .then(AuthenticationService.getAuthenticatedProfile)
            .then(function(profile) {

                if (profile === null) // There is no Profile
                {
                    $location.path('/createProfile'); // Redirect to create a Profile
                } else // Redirect to Event List page
                {
                    $window.sessionStorage.profile = JSON.stringify(profile); // Save the profile to session
                    $location.path('/events');
                }
            })
            .catch (function(error) {
                $scope.error = "Something bad happened. We don't understand what";
                return;
            });
        };
    }
]);
