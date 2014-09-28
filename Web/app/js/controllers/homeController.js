'use strict';

/* Controllers */

angular.module('yieldtome.controllers', [])

.controller('Home', ['$scope', '$location', '$log', '$routeParams', '$cookieStore', '$auth', 'growl', 'SessionService', 'AuthenticationService',
    function($scope, $location, $log, $routeParams, $cookieStore, $auth, growl, SessionService, AuthenticationService) {

        $log.debug("Home controller executing");

        $scope.login = function() { // Get an apiToken and try to get a profile

            $log.debug('HomeController.login() starting');
            growl.addInfoMessage('Attempting to log you in...', 5000);

            // Facebook Login start
            $auth.authenticate('facebook').then(function(result) {
                $log.debug("Facebook Authentication has returned");

                AuthenticationService.login(result.data) // Persist the login token
                .then(function(profile){
                    $location.path("/events");
                })
                .catch(function(error) {
                $log.warn(error);
                if (error != "There is no authenticated API token") { // This is actually a handled exception
                    growl.addErrorMessage("Something bad happened. " + error);
                }
            });
            })
            .catch(function(error) {
                $log.warn(error);
                growl.addErrorMessage("We weren't able to login you in. Did you authorize our Facebook request?");
            });
        };
    }
]);
