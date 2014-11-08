'use strict';

describe('The CreatePoll controller', function() {

    var $scope, $location, $q, $controller, $log, growl, SessionService, PollService;

    beforeEach(function() {
        module('yieldtome.services');
        module('yieldtome.controllers');

        inject(function($rootScope, _$log_, _$controller_, _$q_, _SessionService_) {
            $scope = $rootScope.$new();
            $q = _$q_;
            $controller = _$controller_;
            $log = _$log_;
            SessionService = _SessionService_;

            // Create Mocks 
            PollService = jasmine.createSpyObj('PollService', ['createPoll']);
            $location = jasmine.createSpyObj('$location', ['path']);
            growl = jasmine.createSpyObj('growl', ['addInfoMessage', 'addErrorMessage']);
        });
    });

    function initializeController() {
        $controller('CreatePoll', {
            $scope: $scope,
            $location: $location,
            $log: $log,
            growl: growl,
            SessionService: SessionService,
            PollService: PollService
        });
    }

    describe('should initialise', function() {
        
        it('should display an error if Profile or Event information is not available', function() {
            SessionService.set('profile', null);
            initializeController();
            expect(growl.addErrorMessage).toHaveBeenCalledWith("We don't have enough information to have you create a Poll");           
        });

        it("and set the Poll's creator as the authenticated profile", function() {
            SessionService.set('profile', { ProfileID: 1 }); // Set authenticatedProfile
            SessionService.set('event', 'ValidEvent');

            initializeController();
            expect($scope.poll.CreatorID).toBe(1);
        });
    });

    describe('has a save() function', function() {
        
        beforeEach(function(){
            SessionService.set('profile', { ProfileID: 1 }); // Set authenticatedProfile
            SessionService.set('event', 'ValidEvent');

            initializeController();
        });

        it("that should redirect to the Polls page if the Poll creation succeeds", function() {

            // Set up Mock to return a valid response
            var createPollResponse = $q.defer();
            createPollResponse.resolve({
                Name: 'New Poll'
            });

            PollService.createPoll.andReturn(createPollResponse.promise); // Return a valid profile

            $scope.save();
            $scope.$digest();

            expect($location.path).toHaveBeenCalledWith("/polls"); // Check redirection
        });

        it("that displays an error if something catastrophic happens", function() {

            // Set up Mock to return an error response
            var createPollResponse = $q.defer();
            createPollResponse.reject('EpicFail');

            PollService.createPoll.andReturn(createPollResponse.promise); // Return an error

            $scope.save();
            $scope.$digest();

            expect(growl.addErrorMessage).toHaveBeenCalledWith("Something went wrong trying to create this Poll. EpicFail");
        });
    });
});
