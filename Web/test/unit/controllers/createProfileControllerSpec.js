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

            expect($scope.profile).not.toBeNull();
 /*           expect($scope.profile.id).toBe('123');
            expect($scope.profile.name).toBe('Bradley');
            expect($scope.profile.email).toBe('bradley@yieldto.me');
*/
        });
    });
});
