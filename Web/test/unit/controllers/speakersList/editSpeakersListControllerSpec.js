'use strict';

describe('The EditSpeakersList controller', function() {

    var $scope, $location, $q, $controller, $log, $window, $routeParams, SessionService, SpeakersListService;

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
            SpeakersListService = jasmine.createSpyObj('SpeakersListService', ['getList', 'updateList']);
            $location = jasmine.createSpyObj('$location', ['path']);

        });
    });

    function initializeController() {
        $routeParams = { speakersListID: 1 };

        SessionService.set('profile', 'ValidProfile'); // Set authenticatedProfile
        SessionService.set('event', 'ValidEvent'); // Set event

        // Initialise the controller
        // $scope, $location, $log, $window, $routeParams, SessionService, SpeakersListService
        $controller('EditSpeakersList', {
            $scope: $scope,
            $location: $location,
            $log: $log,
            $window: $window,
            $routeParams: $routeParams,
            SessionService: SessionService,
            SpeakersListService: SpeakersListService
        });

        $scope.$digest();
    }

    describe('when it initiaties', function() {

        it("should set the profile and event values if they are in session", function() {
            var getListResponse = $q.defer();
            getListResponse.resolve('ValidList');
            SpeakersListService.getList.andReturn(getListResponse.promise);

            initializeController();

            expect($scope.profile).toBe('ValidProfile');
            expect($scope.event).toBe('ValidEvent');
        });

        it("should display an error if it can not find the Speakers list provided", function(){
            var getListResponse = $q.defer();
            getListResponse.reject('EpicFail');

            SpeakersListService.getList.andReturn(getListResponse.promise);
            initializeController();

            expect($scope.error).toBe("Something went wrong trying to get this Speakers List");
        });
    });

    describe('has a save() function', function() {

        beforeEach(function(){
            var getListResponse = $q.defer();
            getListResponse.resolve('ValidList');
            SpeakersListService.getList.andReturn(getListResponse.promise);
 
            initializeController();
        });

        it("that should update the List name and display a confirmation if change succeeds", function() {

            var updateListResponse = $q.defer();
            updateListResponse.resolve({
                SpeakersListID: 1,
                Name: 'Mock list'
            });

            SpeakersListService.updateList.andReturn(updateListResponse.promise); // Return a valid list

            $scope.list = {
                Name: 'Scope list',
                CreatorID: 1
            };

            $scope.save();
            $scope.$digest();

            expect($scope.list.Name).toBe('Mock list');
            expect($scope.info).toBe('You successfully renamed this Speakers List');
        });

        it("that displays an error if something catastrophic happens", function() {

            // Set up Mock to return an error response from SpeakersListService.createSpeakersList()
            var updateListResponse = $q.defer();
            updateListResponse.reject({ Message: "EpicFail" });

            SpeakersListService.updateList.andReturn(updateListResponse.promise);

            $scope.list = {
                Name: 'Scope list',
                CreatorID: 1
            };
            $scope.save();
            $scope.$digest();

            expect($scope.error).toBe("Something went wrong trying to rename this Speakers List. EpicFail");
        });
    });
});
