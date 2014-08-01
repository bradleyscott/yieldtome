'use strict';

/* Controllers */

angular.module('yieldtome.controllers', [])

.controller('Home', ['$scope', '$location', '$log', '$routeParams', 'growl', 'SessionService', 'AuthenticationService',
    function($scope, $location, $log, $routeParams, growl, SessionService, AuthenticationService) {

        $log.debug("Home controller executing");

        // Controller initialize
        (function() {

            if($routeParams.logout == true) {
                AuthenticationService.logOut(); // Log hte user out  
                growl.addInfoMessage("You have been logged out");   
            }         
        })();

        $scope.login = function() { // Get an apiToken and try to get a profile

            $log.debug('HomeController.login() starting');
            growl.addInfoMessage('Attempting to log you in...');

            var tokenPromise = AuthenticationService.getApiToken();
            tokenPromise.then(function(token) { // Process the token
                if (token === null) { // The user didn't authenticate
                    growl.addErrorMessage("We weren't able to login you in. Did you authorize our Facebook request?");
                    return;
                }
            })
            .catch (function(error) {
                $log.warn(error);
                growl.addErrorMessage("We weren't able to login you in. Did you authorize our Facebook request?");
                return;
            })
            .then(AuthenticationService.getAuthenticatedProfile)
            .then(function(profile) {

                if (profile === null) { // There is no Profile
                    $location.path('/createProfile'); // Redirect to create a Profile
                } else { // Redirect to Event List page
                    SessionService.set('profile', profile); // Save the profile to session
                    $location.path('/events');
                }
            })
            .catch (function(error) {
                $log.warn(error);
                if(error != "There is no authenticated API token") { // This is actually a handled exception
                    growl.addErrorMessage("Something bad happened. We don't understand what");                    
                }
            });
        };
    }
]);
