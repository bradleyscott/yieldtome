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
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {templateUrl: 'partials/home.html', controller: 'Home'});
  $routeProvider.when('/createProfile', {templateUrl: 'partials/profile.html', controller: 'CreateProfile'});
  $routeProvider.when('/eventList', {templateUrl: 'partials/eventList.html', controller: 'EventList'});
  $routeProvider.otherwise({redirectTo: '/'});
}])
.config(['FacebookProvider', function(FacebookProvider, ConfigService) {
     FacebookProvider.init('233412823470428');
}]);

