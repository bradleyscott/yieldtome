'use strict';

describe('The EditSpeakersList controller', function() {

    var $scope, $location, $q, $controller, $log, $window, $routeParams, $modal, growl, SessionService, SpeakersListService;

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
            SpeakersListService = jasmine.createSpyObj('SpeakersListService', ['getList', 'updateList', 'deleteList']);
            $location = jasmine.createSpyObj('$location', ['path']);
            $modal = jasmine.createSpyObj('$modal', ['open']);
            growl = jasmine.createSpyObj('growl', ['addInfoMessage', 'addErrorMessage']);
        });
    });

    function initializeController() {
        $routeParams = { speakersListID: 1 };

        SessionService.set('profile', 'ValidProfile'); // Set authenticatedProfile
        SessionService.set('event', 'ValidEvent'); // Set event

        // Initialise the controller
        $controller('EditSpeakersList', {
            $scope: $scope,
            $location: $location,
            $log: $log,
            $window: $window,
            $routeParams: $routeParams,
            $modal: $modal,
            growl: growl,
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

            expect(growl.addErrorMessage).toHaveBeenCalledWith("Something went wrong trying to get this Speakers List");
        });
    });

    describe('has a deleteList() function', function() {

        beforeEach(function(){
            var getListResponse = $q.defer();
            getListResponse.resolve('ValidList');
            SpeakersListService.getList.andReturn(getListResponse.promise);
 
            initializeController();
        });
        
        it("that deletes the Speakers list and returns to the Speakers Lists page", function() {
            var deleteListResponse = $q.defer();
            deleteListResponse.resolve({});

            SpeakersListService.deleteList.andReturn(deleteListResponse.promise);

            $scope.list = { Name: 'List 1' };
            $scope.deleteList();
            $scope.$digest();

            expect(growl.addInfoMessage).toHaveBeenCalledWith('List 1 deleted');
            expect($location.path).toHaveBeenCalledWith('/speakersLists');
        });

        it("that displays an error if something catastrophic happens", function() {
            var deleteListResponse = $q.defer();
            deleteListResponse.reject('EpicFail');

            SpeakersListService.deleteList.andReturn(deleteListResponse.promise); // Return an error

            $scope.deleteList();
            $scope.$digest();

            expect(growl.addErrorMessage).toHaveBeenCalledWith("Something went wrong trying to delete this Speakers List");
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
            expect(growl.addInfoMessage).toHaveBeenCalledWith('You successfully renamed Mock list');
        });

        it("that displays an error if something catastrophic happens", function() {

            // Set up Mock to return an error response from SpeakersListService.createSpeakersList()
            var updateListResponse = $q.defer();
            updateListResponse.reject("EpicFail");

            SpeakersListService.updateList.andReturn(updateListResponse.promise);

            $scope.list = {
                Name: 'Scope list',
                CreatorID: 1
            };
            $scope.save();
            $scope.$digest();

            expect(growl.addErrorMessage).toHaveBeenCalledWith("Something went wrong trying to rename this Speakers List. EpicFail");
        });
    });
});
