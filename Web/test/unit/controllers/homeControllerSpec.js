'use strict';

describe('The Home controller', function() {

    var $scope, $location, $q, AuthenticationService;

    beforeEach(function() {
        module('yieldtome.services');
        module('yieldtome.controllers');

        inject(function($rootScope, $log, $controller, _$q_) {
            $scope = $rootScope.$new();
            $q = _$q_;

            // Create Mocks 
            AuthenticationService = jasmine.createSpyObj('AuthenticationService', ['getApiToken', 'getAuthenticatedProfile']);
            $location = jasmine.createSpyObj('$location', ['path']);

            // Initialise the controller
            $controller('Home', {
                $scope: $scope,
                $location: $location,
                $log: $log,
                AuthenticationService: AuthenticationService
            });
        });
    });

    it("should display an error if there was a huge fail when talking to Facebook", function() {
        var getApiTokenResponse = $q.defer();
        getApiTokenResponse.reject('HugeFail');
        AuthenticationService.getApiToken.andReturn(getApiTokenResponse.promise); // Make the getApiToken call returns an error

        $scope.login(); // Hit the login function
        $scope.$digest();

        expect($scope.error).not.toBeNull(); // Check the $scope.error value
        expect($scope.error).toBe("We weren't able to login you in. Did you authorize our Facebook request?");
    });

    it("should display an error if the user doesn't authenticate with Facebook or grant permissions", function() {
        var getApiTokenResponse = $q.defer();
        getApiTokenResponse.resolve(null);
        AuthenticationService.getApiToken.andReturn(getApiTokenResponse.promise); // Make the getApiToken call return null

        $scope.login(); // Hit the login function
        $scope.$digest();

        expect($scope.error).not.toBeNull(); // Check the $scope.error value
        expect($scope.error).toBe("We weren't able to login you in. Did you authorize our Facebook request?");
    });

    it('should redirect to the events page if there is an existing Profile', function() {
        var getApiTokenResponse = $q.defer();
        getApiTokenResponse.resolve('ValidToken');
        AuthenticationService.getApiToken.andReturn(getApiTokenResponse.promise); // Return a valid Token

        var getAuthenticatedProfileResponse = $q.defer();
        getAuthenticatedProfileResponse.resolve('ValidProfile');
        AuthenticationService.getAuthenticatedProfile.andReturn(getAuthenticatedProfileResponse.promise); // Return a valid Profile

        $scope.login(); // Hit the login function
        $scope.$digest();

        expect($location.path).toHaveBeenCalledWith("/events") // Check redirection to eventList
    });

    it('should redirect to the createProfile page if there is no existing Profile', function() {
        var getApiTokenResponse = $q.defer();
        getApiTokenResponse.resolve('ValidToken');
        AuthenticationService.getApiToken.andReturn(getApiTokenResponse.promise); // Return a valid Token

        var getAuthenticatedProfileResponse = $q.defer();
        getAuthenticatedProfileResponse.resolve(null);
        AuthenticationService.getAuthenticatedProfile.andReturn(getAuthenticatedProfileResponse.promise); // Return a null Profile

        $scope.login(); // Hit the login function
        $scope.$digest();

        expect($location.path).toHaveBeenCalledWith("/createProfile") // Check redirection to createProfile
    });
});
