'use strict';

/* Services */

angular.module('yieldtome.services', ['ngResource'])

.service('ConfigService', ['$http',
    function($http) {
        this.apiUrl = 'http://localhost:61353/';
    }
]);
