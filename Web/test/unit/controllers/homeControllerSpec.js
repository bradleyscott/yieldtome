'use strict';

describe('The Home controller', function() {

    var $scope, $location, $routeParams, $q, $log, growl, $controller, AuthenticationService;

    beforeEach(function() {
        module('yieldtome.services');
        module('yieldtome.controllers');

        inject(function($rootScope, _$log_, _$controller_, _$q_) {
            $scope = $rootScope.$new();
            $log = _$log_;
            $controller = _$controller_;
            $q = _$q_;

            // Create Mocks 
            AuthenticationService = jasmine.createSpyObj('AuthenticationService', ['getApiToken', 'getAuthenticatedProfile', 'logOut']);
            $location = jasmine.createSpyObj('$location', ['path']);
            growl = jasmine.createSpyObj('growl', ['addInfoMessage', 'addErrorMessage']);
        });
    });

    function initializeController() {
        // Initialise the controller
        // $scope, $location, $log, $routeParams, growl, SessionService, AuthenticationService
        $controller('Home', {
            $scope: $scope,
            $location: $location,
            $routeParams: $routeParams,
            growl: growl,
            $log: $log,
            AuthenticationService: AuthenticationService
        });
    }

    describe('when initialising', function() {

        it("should log the user out if the logout routeparam exists", function() {
            $routeParams = { logout: true };
   
            initializeController();
            expect(AuthenticationService.logOut.calls.length == 1);
        });
    });

    describe('has a login function', function() {

        beforeEach(function(){
            $routeParams = {};
            initializeController();
        });

        it("that should display an error if there was a huge fail when talking to Facebook", function() {
            var getApiTokenResponse = $q.defer();
            getApiTokenResponse.reject('HugeFail');
            AuthenticationService.getApiToken.andReturn(getApiTokenResponse.promise); // Make the getApiToken call returns an error

            $scope.login(); // Hit the login function
            $scope.$digest();

            expect(growl.addErrorMessage).toHaveBeenCalledWith("We weren't able to login you in. Did you authorize our Facebook request?");
        });

        it("that should display an error if the user doesn't authenticate with Facebook or grant permissions", function() {
            var getApiTokenResponse = $q.defer();
            getApiTokenResponse.resolve(null);
            AuthenticationService.getApiToken.andReturn(getApiTokenResponse.promise); // Make the getApiToken call return null

            $scope.login(); // Hit the login function
            $scope.$digest();

            expect(growl.addErrorMessage).toHaveBeenCalledWith("We weren't able to login you in. Did you authorize our Facebook request?");
        });

        it('that should redirect to the events page if there is an existing Profile', function() {
            var getApiTokenResponse = $q.defer();
            getApiTokenResponse.resolve('ValidToken');
            AuthenticationService.getApiToken.andReturn(getApiTokenResponse.promise); // Return a valid Token

            var getAuthenticatedProfileResponse = $q.defer();
            getAuthenticatedProfileResponse.resolve('ValidProfile');
            AuthenticationService.getAuthenticatedProfile.andReturn(getAuthenticatedProfileResponse.promise); // Return a valid Profile

            $scope.login(); // Hit the login function
            $scope.$digest();

            expect($location.path).toHaveBeenCalledWith("/events"); // Check redirection to eventList
        });

        it('that should redirect to the createProfile page if there is no existing Profile', function() {
            var getApiTokenResponse = $q.defer();
            getApiTokenResponse.resolve('ValidToken');
            AuthenticationService.getApiToken.andReturn(getApiTokenResponse.promise); // Return a valid Token

            var getAuthenticatedProfileResponse = $q.defer();
            getAuthenticatedProfileResponse.resolve(null);
            AuthenticationService.getAuthenticatedProfile.andReturn(getAuthenticatedProfileResponse.promise); // Return a null Profile

            $scope.login(); // Hit the login function
            $scope.$digest();

            expect($location.path).toHaveBeenCalledWith("/createProfile"); // Check redirection to createProfile
        });
    });
});
