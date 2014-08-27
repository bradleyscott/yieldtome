'use strict';

angular.module('yieldtome.controllers')

.controller('ViewProfile', ['$scope', '$log', '$window', '$routeParams', 'growl', 'ProfileService', 'LikeService', 'SessionService',
    function($scope, $log, $window, $routeParams, growl, ProfileService, LikeService, SessionService) {

        $log.debug("ViewProfile controller executing");

        $scope.title = 'View Profile';
        $scope.alternatebutton = 'Back';
        $scope.profile; // The profile to view
        $scope.thisUserProfile; // THe profile of this user
        $scope.formDisabled = true;
        $scope.doesLikeExist = false;
        $scope.isLikeRequited = false;

        $scope.$back = function() {
            $window.history.back();
        };

        $scope.likeProfile = function(){
            $log.debug('ViewProfile.likeProfile() starting');

            var promise = LikeService.createLike($scope.thisUserProfile, $scope.profile);
            promise.then(function(data){
                $scope.doesLikeExist = true;
                $scope.isLikeRequited = data;
                growl.addInfoMessage('You just liked ' + $scope.profile.Name);  
            })
            .catch (function(error) { // The service crapped out
                $log.warn(error);
                growl.addErrorMessage("Something went wrong trying to like " + $scope.profile.Name + ". " + error);
            });
        };

        $scope.refreshLikes = function() {
            $log.debug('ViewProfile.refreshLikes() starting');

            // Update doesLikeExist
            var existPromise = LikeService.doesLikeExist($scope.thisUserProfile, $scope.profile);

            existPromise.then(function(data) { // It all went well
                $scope.doesLikeExist = data;

                if(data) { // Find out if the like is requited
                    var requitedPromise = LikeService.isLikeRequited($scope.thisUserProfile, $scope.profile);
                    requitedPromise.then(function(data) {
                        $scope.isLikeRequited = data;
                    })
                    .catch(function(error) {
                        $log.warn(error);
                        growl.addErrorMessage("Something went wrong trying to determine if " + $scope.profile.Name + " likes you. " + error);
                    });
                }
            })
            .catch (function(error) { // The service crapped out
                $log.warn(error);
                growl.addErrorMessage("Something went wrong trying to determine if " + $scope.profile.Name + " likes you. " + error);
            });
        };

        // Controller initialization
        (function() {
            $scope.thisUserProfile = SessionService.get('profile');
            var profileID = $routeParams.profileID;
            var promise = ProfileService.getProfile(profileID);

            promise.then(function(profile) {
                $scope.profile = profile;
                $scope.refreshLikes();
            })
            .catch (function(error) {
                $log.warn(error);
                growl.addErrorMessage("Something went wrong trying to get this Profile");
            });
        })();

    }
]);
