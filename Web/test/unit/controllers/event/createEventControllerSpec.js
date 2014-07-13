'use strict';

describe('The CreateEvent controller', function() {

    var $scope, $location, $q, $controller, $log, $filter, SessionService, EventService;

    beforeEach(function() {
        module('yieldtome.services');
        module('yieldtome.controllers');

        inject(function($rootScope, _$log_, _$controller_, _$q_, _$filter_, _SessionService_) {
            $scope = $rootScope.$new();
            $q = _$q_;
            $controller = _$controller_;
            $log = _$log_;
            $filter = _$filter_;
            SessionService = _SessionService_;

            // Create Mocks 
            EventService = jasmine.createSpyObj('EventService', ['createEvent']);
            $location = jasmine.createSpyObj('$location', ['path']);

            SessionService.set('profile', {
                    "ProfileID": 1,
                    "Name": "Bradley Scott",
                    "ProfilePictureUri": "http://graph.facebook.com/553740394/picture",
                    "FacebookID": "553740394",
                    "FacebookProfileUri": "http://www.facebook.com/553740394",
                    "Email": "bradley@yieldto.me",
                    "EmailToUri": "mailto://bradley@yieldto.me",
                    "Phone": "555 125-3459",
                    "Twitter": "tweetme",
                    "TwitterProfileUri": "http://twitter.com/tweetme",
                    "LinkedIn": "linkedin",
                    "LinkedinProfileUri": "http://www.linkedin.com/in/linkedin",
                    "IsFacebookPublic": true,
                    "IsEmailPublic": true,
                    "IsPhonePublic": false,
                    "IsTwitterPublic": false,
                    "IsLinkedInPublic": true
                }); // Set authenticatedProfile

            // Initialise the controller
            $controller('CreateEvent', {
                $scope: $scope,
                $location: $location,
                $log: $log,
                $filter: $filter,
                SessionService: SessionService,
                EventService: EventService
            });
        });
    });

    describe('should initialise a default Event', function() {

        it("that should be bound to scope.event", function() {
            expect($scope.event).not.toBeNull();
            expect($scope.event.Name).toBe('New Event');

            // Start and End dates should be set to today
            var today = new Date();
            expect($scope.event.StartDate.getYear()).toBe(today.getYear());
            expect($scope.event.StartDate.getMonth()).toBe(today.getMonth());
            expect($scope.event.StartDate.getDate()).toBe(today.getDate());

            expect($scope.event.EndDate.getYear()).toBe(today.getYear());
            expect($scope.event.EndDate.getMonth()).toBe(today.getMonth());
            expect($scope.event.EndDate.getDate()).toBe(today.getDate());
        });
    });

    describe('has some watchers for scope changes', function() {

        it("that should watch for changes to startDateAsString and updates event.StartDate", function() {
            var startDate = $scope.StartDate;
            $scope.startDateAsString = '2010-01-01'; // Change to a prior date
            expect($scope.event.StartDate).not.toBe(startDate);
        });

        it("that should watch for changes to endDateAsString and updates event.EndDate", function() {
            var endDate = $scope.EndDate;
            $scope.endDateAsString = '2010-01-01'; // Change to a prior date
            expect($scope.event.EndDate).not.toBe(endDate);
        });
    });

    describe('has a save() function', function() {

        it("that should redirect to the events page if the profile creation succeeds", function() {

            // Set up Mock to return a valid response from EventService.createEvent()
            var createEventResponse = $q.defer();
            createEventResponse.resolve({
                EventID: 1
            });

            EventService.createEvent.andReturn(createEventResponse.promise); // Return a valid profile

            $scope.save();
            $scope.$digest();

            expect($location.path).toHaveBeenCalledWith("/events"); // Check redirection
        });

        it("that displays an error if something catastrophic happens", function() {

            // Set up Mock to return an error response from EventService.createEvent()
            var createEventResponse = $q.defer();
            createEventResponse.reject('EpicFail');

            EventService.createEvent.andReturn(createEventResponse.promise); // Return a valid profile

            $scope.save();
            $scope.$digest();

            expect($scope.error).not.toBeNull(); // Check the $scope.error value
            expect($scope.error).toBe("Something went wrong trying to create your Event. EpicFail");
        });
    });
});
