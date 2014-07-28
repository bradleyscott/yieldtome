'use strict';

angular.module('yieldtome.controllers')

.controller('CreateProfile', ['$scope', '$location', '$log', '$window', 'growl', 'SessionService', 'AuthenticationService', 'FacebookService', 'ProfileService',
    function($scope, $location, $log, $window, growl, SessionService, AuthenticationService, FacebookService, ProfileService) {

        $log.debug("CreateProfile controller executing");

        $scope.title = 'Create Profile';
        $scope.alternatebutton = 'Cancel';
        $scope.profile;

        $scope.$back = function() {
            $window.history.back();
        };

        $scope.save = function() // Create a new Profile
        {
            $log.debug('CreateProfile.save() starting');
            var promise = ProfileService.createProfile($scope.profile);

            promise.then(function(profile) { // It all went well
                AuthenticationService.getAuthenticatedProfile(); // Sets the currently Authenticated profile in the AuthenticateService
                SessionService.set('profile', profile); // Saves the profile in session
                growl.addInfoMessage("You have successfully set up a yieldto.me profile");
                $location.path('/events'); // Redirect to the Events list page
            })
            .catch (function(error) { // The service crapped out
                $log.warn(error);
                growl.addErrorMessage("Something went wrong trying to create your Profile. " + error);
            });
        };

        // Retrieve Facebook User info for initial Profile model
        (function() {

            $log.debug('Retrieving User Info for authenticated user to create Profile model');
            var promise = FacebookService.getUserInfo();

            promise.then(function(info) {
                var profile = {
                    Name: info.name,
                    FacebookID: info.id,
                    ProfilePictureUri: 'http://graph.facebook.com/' + info.id + '/picture',
                    Email: info.email
                };
                $scope.profile = profile;
            })
            .catch (function(error) {
                $log.warn(error);
                growl.addErrorMessage("Something went wrong trying to get your Facebook Profile information");
            });
        })();

    }
]);
