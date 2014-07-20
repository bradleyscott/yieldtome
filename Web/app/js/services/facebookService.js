'use strict';

/* Services */

angular.module('yieldtome.services')

.service('FacebookService', ['$q', '$log', '$facebook',
    function($q, $log, $facebook) {

        this.getFacebookToken = function() {

            $log.debug('Attempting Facebook login to retrieve access token');
            var deferred = $q.defer();

            var getLoginStatusPromise = $facebook.getLoginStatus();
            getLoginStatusPromise.then(function(response) {
                if (response.status === 'connected') {
                    // the user is logged in and has authenticated your
                    // app, and response.authResponse supplies
                    // the user's ID, a valid access token, a signed
                    // request, and the time the access token
                    // and signed request each expire
                    $log.debug('Facebook Access token: ' + response.authResponse.accessToken);
                    deferred.resolve(response.authResponse.accessToken);
                } else if (response.status === 'not_authorized') {
                    // the user is logged in to Facebook,
                    // but has not authenticated your app
                    var error = 'Unable to retrieve access token because user has not authorized this app';
                    $log.warn(error);
                    deferred.reject(error);
                } else {
                    // the user isn't logged in to Facebook.
                    var loginPromise = $facebook.login();
                    loginPromise.then(function(response) {
                        if (response.authResponse) {
                            $log.debug('Facebook Access token: ' + response.authResponse.accessToken);
                            deferred.resolve(response.authResponse.accessToken);
                        } else {
                            var error = 'Still unable to retrieve access token after Login attempt. Status: ' + response.status;
                            $log.warn(error);
                            deferred.reject(error);
                        }
                    });
                }
            });

            return deferred.promise;
        };

        this.getUserInfo = function() {

            $log.debug('Attempting to retrieve Facebook User info');
            var deferred = $q.defer();

            var getTokenPromise = this.getFacebookToken();

            getTokenPromise.then(function(token) {
                // Successfully retrieved a token from Facebook. Now go and get the User Info
                var apiPromise = $facebook.api('/me');
                apiPromise.then(function(user) {
                    $log.debug('Facebook User info retrieved for Facebook User ID: ' + user.id);
                    deferred.resolve(user);
                });
            }, function(error) {
                // There was a problem getting the Facebook token
                $log.warn(error);
                deferred.reject(error);
            });

            return deferred.promise;
        };
    }
]);
