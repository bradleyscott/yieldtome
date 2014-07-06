'use strict';

/* Services */

angular.module('yieldtome.services')

.service('ProfileService', ['ConfigService', '$q', '$http', '$log',
    function(ConfigService, $q, $http, $log) {

        this.getProfile = function(profileID) {

            $log.debug('Attempting to get the Profile associated with ProfileID: ' + profileID);
            var deferred = $q.defer();

            if (profileID == null || profileID == 0) {
                var error = 'Profile ID must be provided';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            }

            var url = ConfigService.apiUrl + 'Profiles/' + profileID;
            $log.debug('Request Url: ' + url);

            $http.get(url).success(function(data) {

                if (data == "null") // No profile yet exists associated with this Profile ID
                {
                    var error = 'No profile associated with ProfileID: ' + profileID;
                    $log.debug(error);
                    deferred.resolve(null);
                } else // Otherwise, there is a Profile associated with this Facesbook ID
                {
                    $log.debug('yieldto.me profile: ' + data.ProfileID);
                    deferred.resolve(data);
                }

            }).error(function(status) { // Otherwise, some unknown error occured
                var error = status.Message;
                $log.warn(error);
                deferred.reject(error);
            });

            return deferred.promise;
        };
        
        this.editProfile = function(profile)
        {
            $log.debug('Attempting to edit Profile');
            var deferred = $q.defer();

            if (profile == null) {
                var error = 'A Profile object is needed';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            } else if (profile.FacebookID == null || profile.Name == null) {
                var error = 'Both FacebookID and Name are mandatory fields on a Profile';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            }

            $log.debug('Attempting to edit Profile with ProfileID: ' + profile.ProfileID);

            var url = ConfigService.apiUrl + 'Profiles';
            $log.debug('Request Url: ' + url);

            $http.put(url, profile).success(function(data) {
                $log.debug('Successfully edited Profile with ProfileID: ' + data.ProfileID);
                deferred.resolve(data);
            }).error(function(status) { // Otherwise, some unknown error occured
                var error = status.Message;
                $log.warn(error);
                deferred.reject(error);
            });

            return deferred.promise;
        };

        this.createProfile = function(profile) {
            $log.debug('Attempting to create a new Profile');
            var deferred = $q.defer();

            if (profile == null) {
                var error = 'A Profile object is needed';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            } else if (profile.FacebookID == null || profile.Name == null) {
                var error = 'Both FacebookID and Name are mandatory fields on a Profile';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            }

            $log.debug('Attempting to create a Profile associated with FacebookID: ' + profile.FacebookID);

            var url = ConfigService.apiUrl + 'Profiles';
            $log.debug('Request Url: ' + url);

            $http.post(url, profile).success(function(data) {
                $log.debug('New Profile created with ProfileID: ' + data.ProfileID);
                deferred.resolve(data);
            }).error(function(status) { // Otherwise, some unknown error occured
                var error = status.Message;
                $log.warn(error);
                deferred.reject(error);
            });

            return deferred.promise;
        };

        this.getProfileByFacebookID = function(facebookID) {

            $log.debug('Attempting to get the Profile associated with FacebookID: ' + facebookID);
            var deferred = $q.defer();

            if (facebookID == null || facebookID.length == 0) {
                var error = 'Facebook ID must be provided';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            }

            var url = ConfigService.apiUrl + 'Profiles?facebookID=' + facebookID;
            $log.debug('Request Url: ' + url);

            $http.get(url).success(function(data) {

                if (data == "null") // No profile yet exists associated with this Facebook ID
                {
                    var error = 'No profile associated with FacebookID: ' + facebookID;
                    $log.debug(error);
                    deferred.resolve(null);
                } else // Otherwise, there is a Profile associated with this Facesbook ID
                {
                    $log.debug('yieldto.me profile: ' + data.ProfileID);
                    deferred.resolve(data);
                }

            }).error(function(status) { // Otherwise, some unknown error occured
                var error = status.Message;
                $log.warn(error);
                deferred.reject(error);
            });

            return deferred.promise;
        };

    }
]);
