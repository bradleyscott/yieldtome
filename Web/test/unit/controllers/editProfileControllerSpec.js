'use strict';

describe('The EditProfile controller', function() {

    var $scope, $location, $q, $controller, $log, ProfileService;

    beforeEach(function() {
        module('yieldtome.services');
        module('yieldtome.controllers');

        inject(function($rootScope, _$log_, _$controller_, _$q_) {
            $scope = $rootScope.$new();
            $q = _$q_;
            $controller = _$controller_;
            $log = _$log_;

            // Create Mocks 
            ProfileService = jasmine.createSpyObj('ProfileService', ['editProfile']);
        });
    });

    describe('should have a save() function', function() {

        it("that should display a confirmation to screen if Profile edits succeed", function() {

            // Set up Mock behaviour to support Controler initialization
            var editProfileResponse = $q.defer();
            editProfileResponse.resolve();

            ProfileService.editProfile.andReturn(editProfileResponse.promise); // Return a valid profile

            // Initialise the controller
            $controller('EditProfile', {
                $scope: $scope,
                $location: $location,
                $log: $log,
                ProfileService: ProfileService
            });

            $scope.save();
            $scope.$digest();

            expect($scope.info).toBe('Your Profile updates just got saved') // Check redirection to eventList
        });

        it("that displays an error if something catastrophic happens", function() {

            // Set up Mock behaviour to support Controler initialization
            var editProfileResponse = $q.defer();
            editProfileResponse.reject('EpicFail');

            ProfileService.editProfile.andReturn(editProfileResponse.promise); // Return an error

            // Initialise the controller
            $controller('EditProfile', {
                $scope: $scope,
                $location: $location,
                $log: $log,
                ProfileService: ProfileService
            });

            $scope.save();
            $scope.$digest();

            expect($scope.error).not.toBeNull(); // Check the $scope.error value
            expect($scope.error).toBe("Something wen't wrong trying to edit your Profile");
        });
    });
});
