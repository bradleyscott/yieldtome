'use strict';

/* Controllers */

angular.module('yieldtome.controllers')

.controller('CreateProfile', function($scope, $location, AuthenticationService, FacebookService, ProfileService) {
    $scope.title = 'Create Profile';
    $scope.error;
    $scope.info;
    $scope.profile;
    
    $scope.$back = function() {
        window.history.back();
    };

    $scope.save = function() // Create a new Profile
    {
        var promise = ProfileService.createProfile($scope.profile);

        promise.then(function(profile) // It all went well
        {
            AuthenticationService.getAuthenticatedProfile(); // Sets the currently Authenticated profile in the AuthenticateService
            $location.path('/eventList'); // Redirect to the Events list page
        })
        .catch(function(error){ // The service crapped out
            console.log(error);
            $scope.error = "Something wen't wrong trying to create your Profile";
        })
    };

    // Retrieve Facebook User info for initial Profile model
    (function() {
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
            console.log(error);
            $scope.error = "Something wen't wrong trying to get your Facebook Profile information";
        });
    })();

});
