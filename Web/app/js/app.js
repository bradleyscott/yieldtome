'use strict';


// Declare app level module which depends on filters, and services
angular.module('yieldtome', [
  'ngRoute',
  'yieldtome.filters',
  'yieldtome.services',
  'yieldtome.directives',
  'yieldtome.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {templateUrl: 'partials/home.html', controller: 'Home'});
  $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
  $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
  $routeProvider.otherwise({redirectTo: '/'});
}]);
