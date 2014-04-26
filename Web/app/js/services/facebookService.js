'use strict';

/* Services */

angular.module('yieldtome.services')

.service('FacebookService', function($q, Facebook) {

    this.getFacebookToken = function() {

        console.log('Attempting Facebook login to retrieve access token');
        var deferred = $q.defer();

        Facebook.getLoginStatus(function(response) {
            if (response.status === 'connected') {
                // the user is logged in and has authenticated your
                // app, and response.authResponse supplies
                // the user's ID, a valid access token, a signed
                // request, and the time the access token
                // and signed request each expire
                console.log('Facebook Access token: ' + response.authResponse.accessToken);
                deferred.resolve(response.authResponse.accessToken);
            } else if (response.status === 'not_authorized') {
                // the user is logged in to Facebook,
                // but has not authenticated your app
                var error = 'Unable to retrieve access token because user has not authorized this app';
                console.log(error);
                deferred.reject(error);
            } else {
                // the user isn't logged in to Facebook.
                Facebook.login(function(response) {
                    if (response.authResponse) {
                        console.log('Facebook Access token: ' + response.authResponse.accessToken);
                        deferred.resolve(response.authResponse.accessToken);
                    } else {
                        var error = 'Still unable to retrieve access token after Login attempt. Status: ' + response.status;
                        console.log(error);
                        deferred.reject(error);
                    }
                });
            }
        });

        return deferred.promise;
    };

    this.getUserInfo = function() {

        console.log('Attempting to retrieve Facebook User info');
        var deferred = $q.defer();

        var promise = this.getFacebookToken();

        promise.then(function(token) {
            // Successfully retrieved a token from Facebook. Now go and get the User Info
            Facebook.api('/me', function(user) {
                console.log('Facebook User info retrieved for Facebook User ID: ' + user.id);
                deferred.resolve(user);
            });
        }, function(error) {
            // There was a problem getting the Facebook token
            console.log(error);
            deferred.reject(error);
        });

        return deferred.promise;
    };
});
