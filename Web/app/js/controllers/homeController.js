'use strict';

/* Controllers */

angular.module('yieldtome.controllers', [])

.controller('Home', ['$scope', '$location', '$log', '$routeParams', '$cookieStore', '$auth', '$modal', 'growl', 'SessionService', 'AuthenticationService',
    function($scope, $location, $log, $routeParams, $cookieStore, $auth, $modal, growl, SessionService, AuthenticationService) {

        $log.debug("Home controller executing");

        // Opens the login modal
        $scope.showLogin = function() {
            $scope.loginConfirm = $modal.open({ 
                templateUrl: 'partials/login.html',
                scope: $scope
            }); 

            $scope.loginConfirm.result.then(function(provider) { // Respond if user clicks login
                $scope.login(provider);
            },
            function(){ // Respond if user cancels the login
                $log.debug('User did not choose to login');
            });
        };

        // Is called when one of the login buttons is clicked on the modal
        $scope.confirmLogin = function(provider) {
            $scope.loginConfirm.close(provider);
        };

        // Is called when the cancel or 'x' buttons are clicked on the modal 
        $scope.cancelLogin = function() {
            $scope.loginConfirm.dismiss();
        };

        $scope.login = function(provider) { // Get an apiToken and try to get a profile

            $log.debug('HomeController.login() starting');
            growl.addInfoMessage('Attempting to log you in...', 5000);

            // Login start
            $auth.authenticate(provider).then(function(result) {
                $log.debug("External authentication has returned");

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
                growl.addErrorMessage("We weren't able to login you in. Did you authorize yieldto.me's login request?");
            });
        };
    }
]);
