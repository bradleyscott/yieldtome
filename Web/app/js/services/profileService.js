'use strict';

/* Services */

angular.module('yieldtome.services')

.service('ProfileService', ['$q', '$http', '$log', 'ConfigService',
    function($q, $http, $log, ConfigService) {

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
                } else // Otherwise, there is a Profile associated with this Profile ID
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
            } else if (profile.Name == null && profile.Email == null) {
                var error = 'Both Name and Email are mandatory fields on a Profile';
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
    }
]);
