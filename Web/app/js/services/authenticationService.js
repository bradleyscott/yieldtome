'use strict';

/* Services */

angular.module('yieldtome.services')

.service('AuthenticationService', function(FacebookService, ConfigService, $resource, $http, $q) {
	
	var fullApiToken;
	
	this.login = function() {
		
		var fbPromise = FacebookService.getAccessToken(); // Get Facebook token
		fbPromise.then(this.getApiToken) // Get yieldtome API token from Facebook token
		.then(function(token) // Save the API token
		{
			console.log('AuthenticationService.ytmToken = ' + token.access_token);
			fullApiToken = token;
		});

		// Use Facebook profile to get yieldtome profile
		
	};

	this.getProfile = function(fullApiToken) {
		
	};
	
	this.getApiToken = function(facebookToken) {

		console.log('Attempting to get yieldto.me token in exchange for Facebook access token: ' + facebookToken);
		var deferred = $q.defer();
		
		if(facebookToken.length == 0 || facebookToken == null)
		{
			deferred.reject('Facebook token must be provided');
			return deferred.promise;
		}

		
		var postUrl = ConfigService.apiUrl + 'Authenticate?token=' + facebookToken;
		console.log('Request Url: ' + postUrl);

		$http.post(postUrl).success(function(data) {
			console.log('yieldto.me token access_token: ' + data.access_token);
			deferred.resolve(data);
		}).error(function(status) {
			var error = 'Problem getting token from API. ' + status;
			console.log(error);
			deferred.reject(error);
		});
		
		return deferred.promise;
	};
});