'use strict';

describe('The CreateProfile controller', function() {

    var $scope, $location, $q, $controller, $log, AuthenticationService, FacebookService, ProfileService;

    beforeEach(function() {
        module('yieldtome.services');
        module('yieldtome.controllers');

        inject(function($rootScope, _$log_, _$controller_, _$q_) {
            $scope = $rootScope.$new();
            $q = _$q_;
            $controller = _$controller_;
            $log = _$log_;

            // Create Mocks 
            AuthenticationService = jasmine.createSpyObj('AuthenticationService', ['getAuthenticatedProfile']);
            FacebookService = jasmine.createSpyObj('FacebookService', ['getUserInfo']);
            ProfileService = jasmine.createSpyObj('ProfileService', ['createProfile']);
            $location = jasmine.createSpyObj('$location', ['path']);

        });
    });

    describe('should get the Authenticated users Facebook profile info', function() {

        it("and add it to $scope if successful", function() {

            // Set up Mock behaviour to support Controler initialization
            var getUserInfoResponse = $q.defer();
            getUserInfoResponse.resolve({
                name: 'Bradley',
                id: '123',
                email: 'bradley@yieldto.me'
            });

            FacebookService.getUserInfo.andReturn(getUserInfoResponse.promise); // Return a valid profile

            // Initialise the controller
            $controller('CreateProfile', {
                $scope: $scope,
                $location: $location,
                $log: $log,
                AuthenticationService: AuthenticationService,
                FacebookService: FacebookService,
                ProfileService: ProfileService
            });

            $scope.$digest();

            expect($scope.profile).not.toBeNull();
            expect($scope.profile.FacebookID).toBe('123');
            expect($scope.profile.Name).toBe('Bradley');
            expect($scope.profile.Email).toBe('bradley@yieldto.me');
            expect($scope.profile.ProfilePictureUri).toBe('http://graph.facebook.com/123/picture');
        });

        it("or display an error if something catastrophic happens", function() {

            // Set up Mock behaviour to support Controler initialization
            var getUserInfoResponse = $q.defer();
            getUserInfoResponse.reject('HugeFail');

            FacebookService.getUserInfo.andReturn(getUserInfoResponse.promise); // Return a valid profile

            // Initialise the controller
            $controller('CreateProfile', {
                $scope: $scope,
                $location: $location,
                $log: $log,
                AuthenticationService: AuthenticationService,
                FacebookService: FacebookService,
                ProfileService: ProfileService
            });

            $scope.$digest();

            expect($scope.error).not.toBeNull(); // Check the $scope.error value
            expect($scope.error).toBe("Something wen't wrong trying to get your Facebook Profile information");
        });
    });

    describe('should have a save() function', function() {

        beforeEach(function() {

            // Set up Mock to return valid Facebook User Info for logged in user
            var getUserInfoResponse = $q.defer();
            getUserInfoResponse.resolve({
                name: 'Bradley',
                id: '123',
                email: 'bradley@yieldto.me'
            });

            FacebookService.getUserInfo.andReturn(getUserInfoResponse.promise); // Return a valid profile
        });

        it("that should redirect to the eventList page if the profile creation succeeds", function() {

            // Set up Mock behaviour to support Controler initialization
            var createProfileResponse = $q.defer();
            createProfileResponse.resolve();

            ProfileService.createProfile.andReturn(createProfileResponse.promise); // Return a valid profile

            // Initialise the controller
            $controller('CreateProfile', {
                $scope: $scope,
                $location: $location,
                $log: $log,
                AuthenticationService: AuthenticationService,
                FacebookService: FacebookService,
                ProfileService: ProfileService
            });

            $scope.save();
            $scope.$digest();

            expect($location.path).toHaveBeenCalledWith("/eventList") // Check redirection to eventList
        });

        it("or display an error if something catastrophic happens", function() {

            // Set up Mock behaviour to support Controler initialization
            var createProfileResponse = $q.defer();
            createProfileResponse.reject('EpicFail');

            ProfileService.createProfile.andReturn(createProfileResponse.promise); // Return an error

            // Initialise the controller
            $controller('CreateProfile', {
                $scope: $scope,
                $location: $location,
                $log: $log,
                AuthenticationService: AuthenticationService,
                FacebookService: FacebookService,
                ProfileService: ProfileService
            });

            $scope.save();
            $scope.$digest();

            expect($scope.error).not.toBeNull(); // Check the $scope.error value
            expect($scope.error).toBe("Something wen't wrong trying to create your Profile");
        });
    });
});
