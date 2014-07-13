'use strict';

describe('The ViewProfile controller', function() {

    var $scope, $location, $q, $controller, $log, $routeParams, ProfileService;

    beforeEach(function() {
        module('yieldtome.services');
        module('yieldtome.controllers');

        // $scope, $location, $log, $window, $routeParams, ProfileService
        inject(function($rootScope, _$log_, _$controller_, _$q_) {
            $scope = $rootScope.$new();
            $q = _$q_;
            $controller = _$controller_;
            $log = _$log_;

            // Create Mocks 
            ProfileService = jasmine.createSpyObj('ProfileService', ['getProfile']);
        });
    });

    it("should get the Profile provided in the url and display it to screen", function() {

        // Set the profileID in the url 
        $routeParams = { profileID: 1 };

        // Set up Mock behaviour to support Controler initialization
        var viewProfileResponse = $q.defer();
        viewProfileResponse.resolve('AwesomeProfile');

        ProfileService.getProfile.andReturn(viewProfileResponse.promise); // Return a valid profile

        // $scope, $location, $log, $window, $routeParams, ProfileService
        // Initialise the controller
        $controller('ViewProfile', {
            $scope: $scope,
            $location: $location,
            $log: $log,
            $routeParams: $routeParams,
            ProfileService: ProfileService
        });

        $scope.$digest();

        expect($scope.profile).toBe('AwesomeProfile');
    });

    it("should display an error to screen if something catastrophic happens", function() {

        // Set the profileID in the url 
        $routeParams = { profileID: 1 };

        // Set up Mock behaviour to support Controler initialization
        var viewProfileResponse = $q.defer();
        viewProfileResponse.reject('EpicFail');

        ProfileService.getProfile.andReturn(viewProfileResponse.promise); // Return a valid profile

        // Initialise the controller
        $controller('ViewProfile', {
            $scope: $scope,
            $location: $location,
            $log: $log,
            $routeParams: $routeParams,
            ProfileService: ProfileService
        });

        $scope.$digest();

        expect($scope.error).toBe("Something went wrong trying to get this Profile");
    });
});
