'use strict';

/* Controllers */

angular.module('yieldtome.controllers', [])

.controller('Home', function($scope, AuthenticationService) {

	console.log("Home controller executing");

	$scope.login = function() {
		AuthenticationService.login();
	};
});
