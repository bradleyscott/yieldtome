'use strict';

describe('The EditAttendee controller', function() {

    var $scope, $location, $q, $controller, $log, $window, $routeParams, $modal, growl, SessionService, AttendeeService;

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
            AttendeeService = jasmine.createSpyObj('AttendeeService', ['getAttendee', 'updateAttendee', 'deleteAttendee']);
            $location = jasmine.createSpyObj('$location', ['path']);
            $modal = jasmine.createSpyObj('$modal', ['open']);
            growl = jasmine.createSpyObj('growl', ['addInfoMessage', 'addErrorMessage']);
        });
    });

    function initializeController() {
        $routeParams = { attendeeID: 1 };

        SessionService.set('profile', 'ValidProfile'); // Set authenticatedProfile
        SessionService.set('event', 'ValidEvent'); // Set event

        // Initialise the controller
        // $scope, $location, $log, $window, $modal, $routeParams, growl, SessionService, AttendeeService
        $controller('EditAttendee', {
            $scope: $scope,
            $location: $location,
            $log: $log,
            $window: $window,
            $modal: $modal,
            $routeParams: $routeParams,
            growl: growl,
            SessionService: SessionService,
            AttendeeService: AttendeeService
        });

        $scope.$digest();
    }

    describe('when it initiaties', function() {

        it("should set the profile and event values if they are in session", function() {
            var getAttendeeResponse = $q.defer();
            getAttendeeResponse.resolve('ValidList');
            AttendeeService.getAttendee.andReturn(getAttendeeResponse.promise);

            initializeController();

            expect($scope.profile).toBe('ValidProfile');
            expect($scope.event).toBe('ValidEvent');
        });

        it("should display an error if it can not find the Attendee provided", function(){
            var getAttendeeResponse = $q.defer();
            getAttendeeResponse.reject('EpicFail');

            AttendeeService.getAttendee.andReturn(getAttendeeResponse.promise);
            initializeController();

            expect(growl.addErrorMessage).toHaveBeenCalledWith("Something went wrong trying to get this Attendee");
        });
    });

    describe('has a deleteAttendee() function', function() {

        beforeEach(function(){
            var getAttendeeResponse = $q.defer();
            getAttendeeResponse.resolve('ValidAttendee');
            AttendeeService.getAttendee.andReturn(getAttendeeResponse.promise);
 
            initializeController();
        });
        
        it("that deletes the Attendee and returns to the Events page", function() {
            var deleteAttendeeResponse = $q.defer();
            deleteAttendeeResponse.resolve({});

            AttendeeService.deleteAttendee.andReturn(deleteAttendeeResponse.promise);

            $scope.attendee = { Name: 'Attendee 1' };
            $scope.deleteAttendee();
            $scope.$digest();

            expect(growl.addInfoMessage).toHaveBeenCalledWith('You are no longer representing Attendee 1');
            expect($location.path).toHaveBeenCalledWith('/events');
        });

        it("that displays an error if something catastrophic happens", function() {
            var deleteAttendeeResponse = $q.defer();
            deleteAttendeeResponse.reject('EpicFail');

            AttendeeService.deleteAttendee.andReturn(deleteAttendeeResponse.promise);

            $scope.deleteAttendee();
            $scope.$digest();

            expect(growl.addErrorMessage).toHaveBeenCalledWith("Something went wrong trying to remove yourself from this delegation");
        });
    });

    describe('has a save() function', function() {

        beforeEach(function(){
            var getAttendeeResponse = $q.defer();
            getAttendeeResponse.resolve('ValidAttendee');
            AttendeeService.getAttendee.andReturn(getAttendeeResponse.promise);
 
            initializeController();
        });

        it("that should update the Attendee name and display a confirmation if change succeeds", function() {

            var updateAttendeeResponse = $q.defer();
            updateAttendeeResponse.resolve({
                AttendeeID: 1,
                Name: 'Mock Attendee'
            });

            AttendeeService.updateAttendee.andReturn(updateAttendeeResponse.promise); // Return a valid Attendee

            $scope.attendee = {
                Name: 'Scope Attendee',
                CreatorID: 1
            };

            $scope.save();
            $scope.$digest();

            expect($scope.attendee.Name).toBe('Mock Attendee');
            expect(growl.addInfoMessage).toHaveBeenCalledWith('You successfully renamed your delegation to Mock Attendee');
        });

        it("that displays an error if something catastrophic happens", function() {

            // Set up Mock to return an error response
            var updateAttendeeResponse = $q.defer();
            updateAttendeeResponse.reject("EpicFail");

            AttendeeService.updateAttendee.andReturn(updateAttendeeResponse.promise);

            $scope.attendee = {
                Name: 'Scope Attendee',
                CreatorID: 1
            };

            $scope.save();
            $scope.$digest();

            expect(growl.addErrorMessage).toHaveBeenCalledWith("Something went wrong trying to rename your delegation. EpicFail");
        });
    });
});
