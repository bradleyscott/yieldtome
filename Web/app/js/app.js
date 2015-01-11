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
    'ngCookies',
    'satellizer',
    'ui.sortable',
    'angular-loading-bar',
    'angular-growl',
    'ngSanitize',
    'ngAnimate',
    'angulartics', 
    'angulartics.google.analytics',
    'angularMoment'
    ])

// Configure routes
.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'partials/home.html',
            controller: 'Home'
        });
        $routeProvider.when('/logout', {
            templateUrl: 'partials/home.html',
            controller: 'Logout'
        });
        $routeProvider.when('/editProfile', {
            templateUrl: 'partials/profile/editProfile.html',
            controller: 'EditProfile'
        });
        $routeProvider.when('/viewProfile/:profileID', {
            templateUrl: 'partials/profile/viewProfile.html',
            controller: 'ViewProfile'
        });
        $routeProvider.when('/events', {
            templateUrl: 'partials/event/listEvents.html',
            controller: 'Events'
        });
        $routeProvider.when('/createEvent', {
            templateUrl: 'partials/event/editEvent.html',
            controller: 'CreateEvent'
        });
        $routeProvider.when('/editEvent/:eventID', {
            templateUrl: 'partials/event/editEvent.html',
            controller: 'EditEvent'
        });
        $routeProvider.when('/attend', {
            templateUrl: 'partials/attendee/editAttendee.html',
            controller: 'CreateAttendee'
        });
        $routeProvider.when('/createAttendee', {
            templateUrl: 'partials/attendee/editAttendee.html',
            controller: 'CreateOtherAttendee'
        });
        $routeProvider.when('/attendees', {
            templateUrl: 'partials/attendee/listAttendees.html',
            controller: 'Attendees'
        });
        $routeProvider.when('/editAttendee/:attendeeID', {
            templateUrl: 'partials/attendee/editAttendee.html',
            controller: 'EditAttendee'
        });
        $routeProvider.when('/attendees/:attendeeID/chat', {
            templateUrl: 'partials/chat/directMessages.html',
            controller: 'DirectMessage'
        });
        $routeProvider.when('/speakersLists', {
            templateUrl: 'partials/speakersList/listSpeakersLists.html',
            controller: 'SpeakersLists'
        });
        $routeProvider.when('/createSpeakersList', {
            templateUrl: 'partials/speakersList/editSpeakersList.html',
            controller: 'CreateSpeakersList'
        });
        $routeProvider.when('/editSpeakersList/:speakersListID', {
            templateUrl: 'partials/speakersList/editSpeakersList.html',
            controller: 'EditSpeakersList'
        });
        $routeProvider.when('/speakers/:speakersListID', {
            templateUrl: 'partials/speakersList/listSpeakers.html',
            controller: 'Speakers'
        });
        $routeProvider.when('/addSpeaker/:speakersListID', {
            templateUrl: 'partials/speakersList/addSpeaker.html',
            controller: 'AddSpeaker'
        });
        $routeProvider.when('/polls', {
            templateUrl: 'partials/poll/listPolls.html',
            controller: 'Polls'
        });
        $routeProvider.when('/createPoll', {
            templateUrl: 'partials/poll/editPoll.html',
            controller: 'CreatePoll'
        });
        $routeProvider.when('/editPoll/:pollID', {
            templateUrl: 'partials/poll/editPoll.html',
            controller: 'EditPoll'
        });
        $routeProvider.when('/polls/:pollID', {
            templateUrl: 'partials/poll/listVotes.html',
            controller: 'Votes'
        });
        $routeProvider.otherwise({
            redirectTo: '/'
        });
    }
])

// Configure settings
.constant('apiUrl','http://localhost:61353/')

// Load the facebook SDK asynchronously
.run(['$rootScope', function($rootScope) {
  (function(){
     // If we've already installed the SDK, we're done
     if (document.getElementById('facebook-jssdk')) {return;}

     // Get the first script element, which we'll use to find the parent node
     var firstScriptElement = document.getElementsByTagName('script')[0];

     // Create a new script element and set its id
     var facebookJS = document.createElement('script'); 
     facebookJS.id = 'facebook-jssdk';

     // Set the new script's source to the source of the Facebook JS SDK
    facebookJS.src = '//connect.facebook.net/en_US/all.js';

     // Insert the Facebook JS SDK into the DOM
     firstScriptElement.parentNode.insertBefore(facebookJS, firstScriptElement);
   }());
}])

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

.config(['$httpProvider', 'growlProvider', '$authProvider', 'apiUrl',
    function($httpProvider, growlProvider, $authProvider, apiUrl) {

        // Setup AuthPoviders
        $authProvider.facebook({
            clientId: '233412823470428',
            redirectUri: location.href,
            url: apiUrl + 'Authenticate/Facebook',
            scope: 'email'
        });

        $authProvider.google({
            url: apiUrl + 'Authenticate/Google',
            redirectUri: location.origin + location.pathname,
            clientId: '894006039167-vdfa761e664erda4m0fff2l316btu7h4.apps.googleusercontent.com'
        });

        $httpProvider.interceptors.push('httpResponseInterceptor'); // Register http interceptor
        $httpProvider.defaults.withCredentials = true;
        
        // Growl settings
        growlProvider.globalTimeToLive(3000);
        growlProvider.onlyUniqueMessages(true);
        growlProvider.globalEnableHtml(true);
    }
]);
