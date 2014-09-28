'use strict';

/* Services */

angular.module('yieldtome.services')

.service('AuthenticationService', ['SessionService', 'ProfileService', '$http', '$q', '$log', '$cookieStore',
    function(SessionService, ProfileService, $http, $q, $log, $cookieStore) {

        this.login = function(token) {
            $log.debug('Persisting login tokens and retrieving authenticated Profile');
            var deferred = $q.defer();

            if(token  == null) {
                var error = 'There is no authenticated API token';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            }

            $log.debug('Persisting API access token');
            SessionService.set('token', token.access_token);

            $log.debug('Saving autoLogin cookie');
            $cookieStore.put('autoLogin', true); // Set an autoLogin cookie

            return this.getAuthenticatedProfile(token);
        };

        this.getAuthenticatedProfile = function(token) {
            $log.debug('Attempting to get yieldto.me Profile from authenticated API token');
            var deferred = $q.defer();

            var profileID = token.userName; // Use Authenticated token to get yieldtome profile
            $log.debug('Authenticated ProfileID from token: ' + profileID);

            ProfileService.getProfile(profileID)
            .then(function(profile) { // Save the profile, even if it is null
                SessionService.set('profile', profile);
                deferred.resolve(profile);
            })
            .catch (function(error) { // Handle unknown errors 
                $log.warn(error);
                deferred.reject(error);
            });

            return deferred.promise;
        };

        this.logOut = function() {
            $log.debug('Logging user out');
            SessionService.set('token', null);
            $cookieStore.remove('autoLogin');
        };

    }
]);
