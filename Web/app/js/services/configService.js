'use strict';

/* Services */

angular.module('yieldtome.services', ['ngResource'])

.service('ConfigService', ['$http',
    function($http) {
        this.apiUrl = 'http://localhost:61353/';
        this.chatApiUrl = 'http://localhost:1337';
    }
]);
