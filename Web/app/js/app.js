'use strict';

// Declare app level module which depends on filters, and services
angular.module('yieldtome', [
    'ngRoute',
    'yieldtome.filters',
    'yieldtome.services',
    'yieldtome.directives',
    'yieldtome.controllers',
    'facebook'
])

// Configure routes
.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'partials/home.html',
            controller: 'Home'
        });
        $routeProvider.when('/createProfile', {
            templateUrl: 'partials/profile.html',
            controller: 'CreateProfile'
        });
        $routeProvider.when('/editProfile', {
            templateUrl: 'partials/profile.html',
            controller: 'EditProfile'
        });
        $routeProvider.when('/viewProfile/:profileID', {
            templateUrl: 'partials/profile.html',
            controller: 'ViewProfile'
        });
        $routeProvider.when('/events', {
            templateUrl: 'partials/events.html',
            controller: 'Events'
        });
        $routeProvider.when('/createEvent', {
            templateUrl: 'partials/event.html',
            controller: 'CreateEvent'
        });
        $routeProvider.when('/attend', {
            templateUrl: 'partials/attend.html',
            controller: 'Attend'
        });
        $routeProvider.when('/eventMenu', {
            templateUrl: 'partials/eventMenu.html',
            controller: ''
        });
        $routeProvider.otherwise({
            redirectTo: '/'
        });
    }
])

// Configure the Facebook provider
.config(['FacebookProvider',
    function(FacebookProvider, ConfigService) {
        FacebookProvider.init('233412823470428');
    }
])

// Handle unauthenticated responses
.factory('httpResponseInterceptor', ['$q', '$location', '$window',
    function($q, $location, $window) {
        return {
            // Always add Authorization header to requests
            request: function(config) {
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
                return config;
            },
            // Do nothing
            response: function(response) {
                return response || $q.when(response);
            },
            // Redirect to home screen on failure
            responseError: function(rejection) {
                if (rejection.status === 401) {
                    $location.path('/'); // .search('returnTo', $location.path());
                }
                return $q.reject(rejection);
            }
        };
    }
])

// Register http interceptor
.config(['$httpProvider',
    function($httpProvider) {
        $httpProvider.interceptors.push('httpResponseInterceptor');
    }
]);
