'use strict';

describe('The EditProfile controller', function() {

    var $scope, $location, $q, $controller, $log, $window, growl, ProfileService;

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
            growl = jasmine.createSpyObj('growl', ['addInfoMessage', 'addErrorMessage']);
            $window = {
                history: jasmine.createSpyObj('$window.history', ['back'])
            };
        });
    });

    describe('should have a save() function', function() {

        beforeEach(function() {
            // Initialise the controller
            $controller('EditProfile', {
                $scope: $scope,
                $location: $location,
                $log: $log,
                $window: $window,
                growl: growl, 
                ProfileService: ProfileService
            });
        });
    
        it("that should display a confirmation to screen if Profile edits succeed", function() {

            // Set up Mock behaviour to support Controler initialization
            var editProfileResponse = $q.defer();
            editProfileResponse.resolve();

            ProfileService.editProfile.andReturn(editProfileResponse.promise); // Return a valid profile

            $scope.save();
            $scope.$digest();

            expect(growl.addInfoMessage).toHaveBeenCalledWith('Your Profile updates just got saved'); // Check redirection to eventList
        });

        it("that displays an error if something catastrophic happens", function() {

            // Set up Mock behaviour to support Controler initialization
            var editProfileResponse = $q.defer();
            editProfileResponse.reject('EpicFail');

            ProfileService.editProfile.andReturn(editProfileResponse.promise); // Return an error

            $scope.save();
            $scope.$digest();

            expect(growl.addErrorMessage).toHaveBeenCalledWith("Something went wrong trying to edit your Profile");
        });
    });
});
