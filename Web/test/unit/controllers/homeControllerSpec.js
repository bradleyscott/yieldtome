'use strict';

describe('The Home controller', function() {

    var $scope, $location, $routeParams, $q, $log, growl, $controller, $cookieStore, $auth, $modal, AuthenticationService;

    beforeEach(function() {
        module('yieldtome.services');
        module('yieldtome.controllers');

        inject(function($rootScope, _$log_, _$controller_, _$q_) {
            $scope = $rootScope.$new();
            $log = _$log_;
            $controller = _$controller_;
            $q = _$q_;

            // Create Mocks 
            AuthenticationService = jasmine.createSpyObj('AuthenticationService', ['login']);
            $location = jasmine.createSpyObj('$location', ['path']);
            $cookieStore = jasmine.createSpyObj('$cookieStore', ['get']);
            growl = jasmine.createSpyObj('growl', ['addInfoMessage', 'addErrorMessage']);
            $auth = jasmine.createSpyObj('$auth', ['authenticate']);
            $modal = jasmine.createSpyObj('$modal', ['open']);

        });
    });

    function initializeController() {
        // Initialise the controller
        $controller('Home', {
            $scope: $scope,
            $location: $location,
            $routeParams: $routeParams,
            $log: $log,
            $cookieStore: $cookieStore,
            $auth: $auth,
            $modal: $modal,
            growl: growl,
            AuthenticationService: AuthenticationService
        });
    }

    describe('has a login function', function() {

        beforeEach(function(){
            $routeParams = {};
            initializeController();

        });

        it("that should display an error if the user did not grant Facebook permissions", function() {
            var authenticateResponse = $q.defer();
            authenticateResponse.reject('EpicFail');
            $auth.authenticate.andReturn(authenticateResponse.promise);

            var loginResponse = $q.defer();
            loginResponse.resolve('ValidToken');
            AuthenticationService.login.andReturn(loginResponse.promise); // Return a valid Token

            $scope.login(); // Hit the login function
            $scope.$digest();

            expect(growl.addErrorMessage).toHaveBeenCalled();
        });

        it("that should display an error if there was a huge fail when trying to retrieve Api tokens, etc", function() {
            var authenticateResponse = $q.defer();
            authenticateResponse.resolve({ data: 'ValidToken'});
            $auth.authenticate.andReturn(authenticateResponse.promise);

            var loginResponse = $q.defer();
            loginResponse.reject('HugeFail');
            AuthenticationService.login.andReturn(loginResponse.promise); // Make the getApiToken call returns an error

            $scope.login(); // Hit the login function
            $scope.$digest();

            expect(growl.addErrorMessage).toHaveBeenCalledWith("Something bad happened. HugeFail");
        });

        it('that should redirect to the events page', function() {
            var authenticateResponse = $q.defer();
            authenticateResponse.resolve({ data: 'ValidToken'});
            $auth.authenticate.andReturn(authenticateResponse.promise);

            var loginResponse = $q.defer();
            loginResponse.resolve('ValidToken');
            AuthenticationService.login.andReturn(loginResponse.promise); // Return a valid Token

            $scope.login(); // Hit the login function
            $scope.$digest();

            expect($location.path).toHaveBeenCalledWith("/events"); // Check redirection to eventList
        });
    });
});
