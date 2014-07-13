'use strict';

// Declare app level module which depends on filters, and services
angular.module('yieldtome', [
    'ngRoute',
    'ngTouch',
    'yieldtome.filters',
    'yieldtome.services',
    'yieldtome.directives',
    'yieldtome.controllers',
    'ui.bootstrap',
    'facebook',
    'ui.sortable',
    'angular-loading-bar'
    ])

// Configure routes
.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'partials/home.html',
            controller: 'Home'
        });
        $routeProvider.when('/createProfile', {
            templateUrl: 'partials/profile/profile.html',
            controller: 'CreateProfile'
        });
        $routeProvider.when('/editProfile', {
            templateUrl: 'partials/profile/profile.html',
            controller: 'EditProfile'
        });
        $routeProvider.when('/viewProfile/:profileID', {
            templateUrl: 'partials/profile/profile.html',
            controller: 'ViewProfile'
        });
        $routeProvider.when('/events', {
            templateUrl: 'partials/event/events.html',
            controller: 'Events'
        });
        $routeProvider.when('/createEvent', {
            templateUrl: 'partials/event/event.html',
            controller: 'CreateEvent'
        });
        $routeProvider.when('/editEvent/:eventID', {
            templateUrl: 'partials/event/event.html',
            controller: 'EditEvent'
        });
        $routeProvider.when('/attend', {
            templateUrl: 'partials/event/attend.html',
            controller: 'Attend'
        });
        $routeProvider.when('/landing', {
            templateUrl: 'partials/event/landing.html',
            controller: 'Landing'
        });
        $routeProvider.when('/speakersLists', {
            templateUrl: 'partials/speakersList/speakersLists.html',
            controller: 'SpeakersLists'
        });
        $routeProvider.when('/createSpeakersList', {
            templateUrl: 'partials/speakersList/editSpeakersList.html',
            controller: 'CreateSpeakersList'
        });
        $routeProvider.when('/speakers/:speakersListID', {
            templateUrl: 'partials/speakersList/speakers.html',
            controller: 'Speakers'
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
.factory('httpResponseInterceptor', ['$q', '$log', '$location', 'SessionService',
    function($q, $log, $location, SessionService) {
        return {
            // Always add Authorization header to requests
            request: function(config) {

                // $log.debug('Intercepting Http request to inject Auth tokens');
                var token = SessionService.get('token');
                if(token !== undefined)
                    { config.headers.Authorization = 'Bearer ' + token; }
                
                return config;
            },
            // Do nothing
            response: function(response) {
                return response || $q.when(response);
            },
            // Redirect to home screen on failure
            responseError: function(rejection) {
                if (rejection.status === 401) {
                    $log.debug('Unauthenticated (401) response received from API');
                    $location.path('/');
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
