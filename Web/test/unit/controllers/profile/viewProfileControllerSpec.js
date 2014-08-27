'use strict';

describe('The ViewProfile controller', function() {

    var $scope, $location, $q, $controller, $log, $routeParams, growl, ProfileService, LikeService, SessionService;

    beforeEach(function() {
        module('yieldtome.services');
        module('yieldtome.controllers');

        // $scope, $location, $log, $window, $routeParams, ProfileService
        inject(function($rootScope, _$log_, _$controller_, _$q_, _SessionService_) {
            $scope = $rootScope.$new();
            $q = _$q_;
            $controller = _$controller_;
            $log = _$log_;
            SessionService = _SessionService_;

            // Create Mocks 
            ProfileService = jasmine.createSpyObj('ProfileService', ['getProfile']);
            LikeService = jasmine.createSpyObj('LikeService', ['doesLikeExist', 'isLikeRequited', 'createLike']);
            growl = jasmine.createSpyObj('growl', ['addInfoMessage', 'addErrorMessage']);
        });
    });

    function initializeController() {
        // Initialise the controller
        // $scope, $log, $window, $routeParams, growl, ProfileService, LikeService, SessionService) {

        $controller('ViewProfile', {
            $scope: $scope,
            $log: $log,
            $location: $location,
            $routeParams: $routeParams,
            growl: growl,
            ProfileService: ProfileService,
            LikeService: LikeService
        });
    }

    describe('when it initiaties', function() {

        it("should get the Profile provided in the url and display it to screen, and refresh Likes", function() {

            // Set the profileID in the url 
            $routeParams = {
                profileID: 1
            };

            // Set up Mock behaviour to support Controler initialization
            var viewProfileResponse = $q.defer();
            viewProfileResponse.resolve('AwesomeProfile');
            ProfileService.getProfile.andReturn(viewProfileResponse.promise); // Return a valid profile

            var doesLikeExistResponse = $q.defer();
            doesLikeExistResponse.resolve(true);
            LikeService.doesLikeExist.andReturn(doesLikeExistResponse.promise);

            var isLikeRequitedResponse = $q.defer();
            isLikeRequitedResponse.resolve(true);
            LikeService.isLikeRequited.andReturn(isLikeRequitedResponse.promise);

            initializeController();
            $scope.$digest();

            expect($scope.profile).toBe('AwesomeProfile');
            expect(LikeService.doesLikeExist).toHaveBeenCalled();
            expect(LikeService.isLikeRequited).toHaveBeenCalled();
        });

        it("should set doesLikeExist if the Like exists", function() {

            // Set the profileID in the url 
            $routeParams = {
                profileID: 1
            };

            // Set up Mock behaviour to support Controler initialization
            var viewProfileResponse = $q.defer();
            viewProfileResponse.resolve('AwesomeProfile');
            ProfileService.getProfile.andReturn(viewProfileResponse.promise); // Return a valid profile

            var doesLikeExistResponse = $q.defer();
            doesLikeExistResponse.resolve(true);
            LikeService.doesLikeExist.andReturn(doesLikeExistResponse.promise);

            var isLikeRequitedResponse = $q.defer();
            isLikeRequitedResponse.resolve(true);
            LikeService.isLikeRequited.andReturn(isLikeRequitedResponse.promise);

            initializeController();
            $scope.$digest();

            expect($scope.doesLikeExist).toBe(true);
            expect($scope.isLikeRequited).toBe(true);
        });

        it("should display an error to screen if something catastrophic happens", function() {

            // Set the profileID in the url 
            $routeParams = {
                profileID: 1
            };

            // Set up Mock behaviour to support Controler initialization
            var viewProfileResponse = $q.defer();
            viewProfileResponse.reject('EpicFail');

            ProfileService.getProfile.andReturn(viewProfileResponse.promise); // Return a valid profile

            initializeController();
            $scope.$digest();

            expect(growl.addErrorMessage).toHaveBeenCalledWith("Something went wrong trying to get this Profile");
        });
    });

    describe('has a likeProfile function', function() {

        beforeEach(function() {
            // Set the profileID in the url 
            $routeParams = {
                profileID: 1
            };

            // Set up Mock behaviour to support Controler initialization
            var viewProfileResponse = $q.defer();
            viewProfileResponse.resolve({ Name: "AwesomeProfile" });
            ProfileService.getProfile.andReturn(viewProfileResponse.promise); // Return a valid profile

            var doesLikeExistResponse = $q.defer();
            doesLikeExistResponse.resolve(true);
            LikeService.doesLikeExist.andReturn(doesLikeExistResponse.promise);

            var isLikeRequitedResponse = $q.defer();
            isLikeRequitedResponse.resolve(true);
            LikeService.isLikeRequited.andReturn(isLikeRequitedResponse.promise);

            initializeController();
            $scope.$digest();
        });


        it("should display an error to screen if something catastrophic happens", function() {

            var createLikeResponse = $q.defer();
            createLikeResponse.reject('EpicFail');
            LikeService.createLike.andReturn(createLikeResponse.promise);

            $scope.likeProfile();
            $scope.$digest();
            expect(growl.addErrorMessage).toHaveBeenCalledWith("Something went wrong trying to like AwesomeProfile. EpicFail");
        });
    });
});
