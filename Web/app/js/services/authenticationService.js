'use strict';

/* Services */

angular.module('yieldtome.services')

.service('AuthenticationService', ['SessionService', 'FacebookService', 'ConfigService', 'ProfileService', '$http', '$q', '$log', '$cookieStore',
    function(SessionService, FacebookService, ConfigService, ProfileService, $http, $q, $log, $cookieStore) {

        var _apiToken, _authenticatedProfile;
        this.apiToken = _apiToken;
        this.authenticatedProfile = _authenticatedProfile;

        this.getAuthenticatedProfile = function() {
            $log.debug('Attempting to get yieldto.me Profile from authenticated API token');
            var deferred = $q.defer();

            if (_apiToken == null || _apiToken.userName == null) {
                var error = 'There is no authenticated API token';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            }

            var facebookID = _apiToken.userName; // Use Authenticated Facebook profile to get yieldtome profile
            $log.debug('Authenticated FacebookID from token: ' + facebookID);

            var profilePromise = ProfileService.getProfileByFacebookID(facebookID);
            profilePromise.then(function(profile) { // Save the profile, even if it is null
                _authenticatedProfile = profile;
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

        this.getApiToken = function() {

            $log.debug('Attempting to get yieldto.me token');
            var deferred = $q.defer();

            var fbPromise = FacebookService.getFacebookToken(); // Get Facebook token

            fbPromise.then(this.getApiTokenFromFacebookToken) // Then get yieldtome API token from Facebook token
            .then(function(token) { // Then persist this token
                _apiToken = token; // Save the API token
                SessionService.set('token', token.access_token); // Save this token

                $log.debug('Saving autoLogin cookie');
                $cookieStore.put('autoLogin', true); // Set an autoLogin cookie
                
                deferred.resolve(_apiToken); // Return the apiToken, even though it's saved                 
            })
            .catch (function(error) { // And, handle any problems
                $log.warn(error);
                deferred.reject(error);
            });

            return deferred.promise;
        };

        this.getApiTokenFromFacebookToken = function(facebookToken) {

            $log.debug('Attempting to get yieldto.me token in exchange for Facebook access token: ' + facebookToken);
            var deferred = $q.defer();

            if (facebookToken.length == 0 || facebookToken == null) {
                var error = 'Facebook token must be provided';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            }

            var postUrl = ConfigService.apiUrl + 'Authenticate?token=' + facebookToken;
            $log.debug('Request Url: ' + postUrl);

            $http.post(postUrl).success(function(data) {

                if (data == null) { // No token granted. e.g. Facebook token failed validation
                    var error = 'No yieldto.me API token was granted. There may have been a problem with the Facebook token provided';
                    $log.warn(error);
                    deferred.rejected(error);
                } 
                else { // A token has in fact been granted
                    $log.debug('yieldto.me token access_token: ' + data.access_token);
                    deferred.resolve(data);
                }

            }).error(function(status) {
                var error = 'Problem getting token from API. ' + status.Message;
                $log.warn(error);
                deferred.reject(error);
            });

            return deferred.promise;
        };
    }
]);
