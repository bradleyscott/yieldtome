'use strict';

/* Services */

angular.module('yieldtome.services', ['ngResource'])

.service('ConfigService', function($http) {
	
	this.apiUrl = "http://localhost:61353/";
	
});