'use strict';

/* Controllers */

angular.module('yieldtome.controllers')

.controller('CreateProfile', ['$scope', '$location', '$log', 'AuthenticationService', 'FacebookService', 'ProfileService',
    function($scope, $location, $log, AuthenticationService, FacebookService, ProfileService) {
    
    $log.debug("CreateProfile controller executing");

    $scope.title = 'Create Profile';
    $scope.error; // An error message that will be displayed to screen
    $scope.info; // An info message that will be displayed to screen
    $scope.profile;
    
    $scope.$back = function() {
        window.history.back();
    };

    $scope.save = function() // Create a new Profile
    {
        $log.debug('CreateProfile.save() starting');
        var promise = ProfileService.createProfile($scope.profile);

        promise.then(function(profile) // It all went well
        {
            AuthenticationService.getAuthenticatedProfile(); // Sets the currently Authenticated profile in the AuthenticateService
            $location.path('/eventList'); // Redirect to the Events list page
        })
        .catch(function(error){ // The service crapped out
            $scope.error = "Something wen't wrong trying to create your Profile";
        })
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
            $scope.error = "Something wen't wrong trying to get your Facebook Profile information";
        });
    })();

}]);
