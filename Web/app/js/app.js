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
  $routeProvider.otherwise({redirectTo: '/'});
  }])
.config(['FacebookProvider', function(FacebookProvider) {
     FacebookProvider.init('233412823470428');
     }]);

