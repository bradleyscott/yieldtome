'use strict';

describe('The CreateSpeakersList controller', function() {

    var $scope, $location, $q, $controller, $log, $window, SessionService, SpeakersListService;

    beforeEach(function() {
        module('yieldtome.services');
        module('yieldtome.controllers');

        inject(function($rootScope, _$log_, _$controller_, _$q_, _$window_, _SessionService_) {
            $scope = $rootScope.$new();
            $q = _$q_;
            $controller = _$controller_;
            $log = _$log_;
            $window = _$window_;
            SessionService = _SessionService_;

            // Create Mocks 
            SpeakersListService = jasmine.createSpyObj('SpeakersListService', ['createList']);
            $location = jasmine.createSpyObj('$location', ['path']);

        });
    });

    describe('when it initiaties', function() {

        it("should display an error to screen if an Event isn't found in session", function() {
            
            SessionService.set('event', undefined);
            SessionService.set('profile', undefined);

            // Initialise the controller
            // $scope, $location, $log, $window, SessionService, SpeakersListService
            $controller('CreateSpeakersList', {
                $scope: $scope,
                $location: $location,
                $log: $log,
                $window: $window,
                SessionService: SessionService,
                SpeakersListService: SpeakersListService
            });

            $scope.$digest();

            expect($scope.error).toBe("We don't have enough information to have you create a Speakers list");
        });

        it("should set the profile and event values if they are in session", function() {

            SessionService.set('profile', 'ValidProfile'); // Set authenticatedProfile
            SessionService.set('event', 'ValidEvent'); // Set event

            // Initialise the controller
            // $scope, $location, $log, $window, SessionService, SpeakersListService
            $controller('CreateSpeakersList', {
                $scope: $scope,
                $location: $location,
                $log: $log,
                $window: $window,
                SessionService: SessionService,
                SpeakersListService: SpeakersListService
            });

            $scope.$digest();

            expect($scope.profile).toBe('ValidProfile');
            expect($scope.event).toBe('ValidEvent');
        });
    });

    describe('has a save() function', function() {

        beforeEach(function(){

            SessionService.set('profile', { ProfileID: 1 }); // Set authenticatedProfile
            SessionService.set('event', { EventID: 1 }); // Set event

            // Initialise the controller
            // $scope, $location, $log, $window, SessionService, SpeakersListService
            $controller('CreateSpeakersList', {
                $scope: $scope,
                $location: $location,
                $log: $log,
                $window: $window,
                SessionService: SessionService,
                SpeakersListService: SpeakersListService
            });

        });

        it("that should redirect to the events page if the profile creation succeeds", function() {

            // Set up Mock to return a valid response from SpeakersListService.createSpeakersList()
            var createListResponse = $q.defer();
            createListResponse.resolve({
                SpeakersListID: 1,
                Name: "Mock list"
            });

            SpeakersListService.createList.andReturn(createListResponse.promise); // Return a valid list

            $scope.name = "New list";
            $scope.save();
            $scope.$digest();

            expect($location.path).toHaveBeenCalledWith("/speakersLists"); // Check redirection
        });

        it("that displays an error if something catastrophic happens", function() {

            // Set up Mock to return an error response from SpeakersListService.createSpeakersList()
            var createListResponse = $q.defer();
            createListResponse.reject({ Message: "EpicFail" });

            SpeakersListService.createList.andReturn(createListResponse.promise);

            $scope.name = "New list";
            $scope.save();
            $scope.$digest();

            expect($scope.error).toBe("Something wen't wrong trying to create this Speakers List. EpicFail");
        });
    });
});
