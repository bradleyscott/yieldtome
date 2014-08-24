'use strict';

describe('The EditEvent controller', function() {

    var $scope, $location, $q, $controller, $log, $window, $modal, $routeParams, $filter, growl, EventService, SessionService;

    beforeEach(function() {
        module('yieldtome.services');
        module('yieldtome.controllers');

        inject(function($rootScope, _$log_, _$filter_, _$controller_, _$q_, _$window_, _SessionService_) {
            $scope = $rootScope.$new();
            $q = _$q_;
            $controller = _$controller_;
            $log = _$log_;
            $window = _$window_;
            $filter = _$filter_;
            SessionService = _SessionService_;

            // Create Mocks 
            EventService = jasmine.createSpyObj('EventService', ['getEvent', 'editEvent', 'deleteEvent']);
            $location = jasmine.createSpyObj('$location', ['path']);
            $modal = jasmine.createSpyObj('$modal', ['open']);
            growl = jasmine.createSpyObj('growl', ['addInfoMessage', 'addErrorMessage']);

            SessionService.set('profile', JSON.stringify({
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
                })); // Set authenticatedProfile
        });
    });

     function initializeController(){

        // $scope, $location, $log, $window, $modal, $routeParams, $filter, growl, SessionService, EventService
        $controller('EditEvent', {
            $scope: $scope,
            $location: $location,
            $log: $log,
            $window: $window,
            $modal: $modal,
            $routeParams: $routeParams,
            $filter: $filter,
            growl: growl,
            EventService: EventService,
            SessionService: SessionService
        }); 
    }

    describe('when initializing', function() {

        it("it should retrieve the Event ID from the URL and display the relevent Event", function() {
            // Set the eventID in the url 
            $routeParams = { eventID: 1 };

            // Set up Mock behaviour to support Controler initialization
            var getEventResponse = $q.defer();
            getEventResponse.resolve('AwesomeEvent');

            EventService.getEvent.andReturn(getEventResponse.promise); // Return a valid event

            initializeController();
            $scope.$digest();

            expect($scope.event).toBe('AwesomeEvent');
        });

        it("that should display an error to screen if something catastrophic happens", function() {

            // Set the eventID in the url 
            $routeParams = { eventID: 1 };

            // Set up Mock behaviour to support Controler initialization
            var getEventResponse = $q.defer();
            getEventResponse.reject('EpicFail');

            EventService.getEvent.andReturn(getEventResponse.promise); // Return invalid event

            initializeController();
            $scope.$digest();

            expect(growl.addErrorMessage).toHaveBeenCalledWith("Something went wrong trying to get this Event");
        });
    });

    describe('should have a save() function', function() {

        beforeEach(function() {
            // Set the eventID in the url 
            $routeParams = { eventID: 1 };

            // Set up Mock behaviour to support Controler initialization
            var getEventResponse = $q.defer();
            getEventResponse.resolve('AwesomeEvent');

            EventService.getEvent.andReturn(getEventResponse.promise); // Return a valid event

            initializeController();
        });
    
        it("that should display a confirmation to screen if Event edits succeed", function() {

            // Set up Mock behaviour to support Controler initialization
            var editEventResponse = $q.defer();
            editEventResponse.resolve();

            EventService.editEvent.andReturn(editEventResponse.promise); // Return a valid profile

            $scope.save();
            $scope.$digest();

            expect(growl.addInfoMessage).toHaveBeenCalledWith('Your Event updates just got saved');
            expect($location.path).toHaveBeenCalledWith("/events"); // Check redirection to eventList
        });

        it("that displays an error if something catastrophic happens", function() {

            // Set up Mock behaviour to support Controler initialization
            var editEventResponse = $q.defer();
            editEventResponse.reject('EpicFail');

            EventService.editEvent.andReturn(editEventResponse.promise); // Return an error

            $scope.save();
            $scope.$digest();

            expect(growl.addErrorMessage).toHaveBeenCalledWith("Something went wrong trying to edit your Event. EpicFail");
        });
    });

    describe('should have a delete() function', function() {

        beforeEach(function() {
            // Set the eventID in the url 
            $routeParams = { eventID: 1 };

            // Set up Mock behaviour to support Controler initialization
            var getEventResponse = $q.defer();
            getEventResponse.resolve('AwesomeEvent');

            EventService.getEvent.andReturn(getEventResponse.promise); // Return a valid event

            initializeController();
        });
    
        it("that should return to the events screen if the delete succeeds", function() {

            // Set up Mock behaviour to support Controler initialization
            var deleteEventResponse = $q.defer();
            deleteEventResponse.resolve();

            EventService.deleteEvent.andReturn(deleteEventResponse.promise); // Return a valid delete

            $scope.delete();
            $scope.$digest();

            expect($location.path).toHaveBeenCalledWith("/events"); // Check redirection to eventList
        });

        it("that displays an error if something catastrophic happens", function() {

            // Set up Mock behaviour to support Controler initialization
            var deleteEventResponse = $q.defer();
            deleteEventResponse.reject('EpicFail');

            EventService.deleteEvent.andReturn(deleteEventResponse.promise); // Return an error

            $scope.delete();
            $scope.$digest();

            expect(growl.addErrorMessage).toHaveBeenCalledWith("Something went wrong trying to delete your Event. EpicFail");
        });
    });

});
