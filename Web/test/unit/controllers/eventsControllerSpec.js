'use strict';

describe('The Events controller', function() {

    var $controller, $log, $scope, $location, $q, $window, EventService, AttendeeService;

    beforeEach(function() {
        module('yieldtome.services');
        module('yieldtome.controllers');

        inject(function($rootScope, _$log_, _$controller_, _$q_, _$window_, _$location_) {
            $scope = $rootScope.$new();
            $q = _$q_;
            $controller = _$controller_;
            $log = _$log_;
            $window = _$window_;
            $location = _$location_;

            // Create Mocks 
            $location = jasmine.createSpyObj('$location', ['path']);
            EventService = jasmine.createSpyObj('EventService', ['getEvents']);
            AttendeeService = jasmine.createSpyObj('AttendeeService', ['getAttendees']);

        });
    });

    describe('when it initiaties', function() {

        it("should get the Events list and display them to screen", function() {

            // Mock getEvents response
            var getEventsResponse = $q.defer();
            getEventsResponse.resolve(
                [{
                    "EventID": 1,
                    "Name": "New Event",
                    "Hashtag": "newevent",
                    "StartDate": "2014-04-20T08:54:11.75",
                    "EndDate": "2014-10-22T08:54:11.75",
                    "CreatorID": 1,
                    "Description": "Description",
                    "DateDescription": "Today",
                    "DisplayDate": "20 Apr to 22 Oct 2014"
                }, {
                    "EventID": 2,
                    "Name": "Another New Event",
                    "Hashtag": "anotherevent",
                    "StartDate": "2014-04-20T08:54:11.953",
                    "EndDate": "2014-10-22T08:54:11.953",
                    "CreatorID": 1,
                    "Description": "Description",
                    "DateDescription": "Today",
                    "DisplayDate": "20 Apr to 22 Oct 2014"
                }]
            );
            EventService.getEvents.andReturn(getEventsResponse.promise);

            // Initialise the controller
            $controller('Events', {
                $scope: $scope,
                $location: $location,
                $log: $log,
                EventService: EventService,
                AttendeeService: AttendeeService
            });

            $scope.$digest();

            expect($scope.events.length).toBe(2);
        });

        it("should display an error if there was a huge fail when trying to get the Events list", function() {

            // Mock getEvents error
            var getEventsResponse = $q.defer();
            getEventsResponse.reject('HugeFail');
            EventService.getEvents.andReturn(getEventsResponse.promise);

            // Initialise the controller
            $controller('Events', {
                $scope: $scope,
                $location: $location,
                $log: $log,
                EventService: EventService,
                AttendeeService: AttendeeService
            });

            $scope.$digest();

            expect($scope.error).toBe("Something wen't wrong trying to get the list of yieldto.me Events");
        });
    });

    describe('when the user selects an Event', function() {

        beforeEach(function() {

            // Mock getEvents response
            var getEventsResponse = $q.defer();
            getEventsResponse.resolve(
                [{
                    "EventID": 1,
                    "Name": "New Event",
                    "Hashtag": "newevent",
                    "StartDate": "2014-04-20T08:54:11.75",
                    "EndDate": "2014-10-22T08:54:11.75",
                    "CreatorID": 1,
                    "Description": "Description",
                    "DateDescription": "Today",
                    "DisplayDate": "20 Apr to 22 Oct 2014"
                }, {
                    "EventID": 2,
                    "Name": "Another New Event",
                    "Hashtag": "anotherevent",
                    "StartDate": "2014-04-20T08:54:11.953",
                    "EndDate": "2014-10-22T08:54:11.953",
                    "CreatorID": 1,
                    "Description": "Description",
                    "DateDescription": "Today",
                    "DisplayDate": "20 Apr to 22 Oct 2014"
                }]
            );
            EventService.getEvents.andReturn(getEventsResponse.promise);

            // Set the authenticated Profile 
            $window.sessionStorage.profile = JSON.stringify({
                "ProfileID": 2,
                "Name": "New Profile 635323921079431766",
                "ProfilePictureUri": "http://graph.facebook.com/635323921079431766/picture",
                "FacebookID": "635323921079431766",
                "FacebookProfileUri": "http://www.facebook.com/635323921079431766",
                "Email": "bradley@yieldto.me",
                "EmailToUri": "mailto://bradley@yieldto.me",
                "Phone": "555 125-3459",
                "Twitter": "tweettome",
                "TwitterProfileUri": "http://twitter.com/tweettome",
                "LinkedIn": "linktome",
                "LinkedinProfileUri": "http://www.linkedin.com/in/linktome",
                "IsFacebookPublic": true,
                "IsEmailPublic": true,
                "IsPhonePublic": false,
                "IsTwitterPublic": false,
                "IsLinkedInPublic": true
            });

            // Initialise the controller
            $controller('Events', {
                $scope: $scope,
                $location: $location,
                $log: $log,
                $window: $window,
                EventService: EventService,
                AttendeeService: AttendeeService
            });

        });

        it("it should display the selected Event information to screen", function() {

            // Mock an empty response to return Attendees
            var getAttendeesResponse = $q.defer();
            getAttendeesResponse.resolve({});
            AttendeeService.getAttendees.andReturn(getAttendeesResponse.promise);

            // The Event to select
            var selectedEvent = {
                EventID: 1
            };

            $scope.$digest();
            $scope.selectEvent(selectedEvent);

            expect($scope.selectedEvent).toBe(selectedEvent);
        });

        it("it should get the Attendees and display the screen", function() {

            var attendees = [{
                "AttendeeID": 8,
                "Name": "australia",
                "Profile": {
                    "ProfileID": 2,
                    "Name": "New Profile 635323921079431766",
                    "ProfilePictureUri": "http://graph.facebook.com/635323921079431766/picture",
                    "FacebookID": "635323921079431766",
                    "FacebookProfileUri": "http://www.facebook.com/635323921079431766",
                    "Email": "bradley@yieldto.me",
                    "EmailToUri": "mailto://bradley@yieldto.me",
                    "Phone": "555 125-3459",
                    "Twitter": "tweettome",
                    "TwitterProfileUri": "http://twitter.com/tweettome",
                    "LinkedIn": "linktome",
                    "LinkedinProfileUri": "http://www.linkedin.com/in/linktome",
                    "IsFacebookPublic": true,
                    "IsEmailPublic": true,
                    "IsPhonePublic": false,
                    "IsTwitterPublic": false,
                    "IsLinkedInPublic": true
                }
            }, {
                "AttendeeID": 9,
                "Name": "New Zealand",
                "Profile": {
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
                }
            }];

            // Mock the getAttendees response
            var getAttendeesResponse = $q.defer();
            getAttendeesResponse.resolve(attendees);
            AttendeeService.getAttendees.andReturn(getAttendeesResponse.promise);

            // The Event to select
            var selectedEvent = {
                EventID: 1
            };

            $scope.$digest();
            $scope.selectEvent(selectedEvent);
            $scope.$digest();

            expect($scope.attendees).toBe(attendees);
        });

        it("should redirect to the Menu page if the authenticated Profile is attending", function() {

            var attendees = [{
                "AttendeeID": 8,
                "Name": "australia",
                "Profile": {
                    "ProfileID": 2,
                    "Name": "New Profile 635323921079431766",
                    "ProfilePictureUri": "http://graph.facebook.com/635323921079431766/picture",
                    "FacebookID": "635323921079431766",
                    "FacebookProfileUri": "http://www.facebook.com/635323921079431766",
                    "Email": "bradley@yieldto.me",
                    "EmailToUri": "mailto://bradley@yieldto.me",
                    "Phone": "555 125-3459",
                    "Twitter": "tweettome",
                    "TwitterProfileUri": "http://twitter.com/tweettome",
                    "LinkedIn": "linktome",
                    "LinkedinProfileUri": "http://www.linkedin.com/in/linktome",
                    "IsFacebookPublic": true,
                    "IsEmailPublic": true,
                    "IsPhonePublic": false,
                    "IsTwitterPublic": false,
                    "IsLinkedInPublic": true
                }
            }];

            // Mock the getAttendees response
            var getAttendeesResponse = $q.defer();
            getAttendeesResponse.resolve(attendees);
            AttendeeService.getAttendees.andReturn(getAttendeesResponse.promise);

            // The Event to select
            var selectedEvent = {
                EventID: 1
            };

            $scope.$digest();
            $scope.selectEvent(selectedEvent);
            $scope.$digest();

            expect($location.path).toHaveBeenCalledWith("/eventMenu") // Check redirection to eventMenu
        });

        it("should display an error if there was a huge fail when trying to get the Attendees", function() {
            // Mock the getAttendees response
            var getAttendeesResponse = $q.defer();
            getAttendeesResponse.reject('EpicFail');
            AttendeeService.getAttendees.andReturn(getAttendeesResponse.promise);

            // The Event to select
            var selectedEvent = {
                EventID: 1
            };

            $scope.$digest();
            $scope.selectEvent(selectedEvent);
            $scope.$digest();

            expect($scope.error).toBe("Something wen't wrong trying to get the list of Attendees");
        });

        it("it should allow the user to de-select an Event by passing in nothing", function() {
            // Mock an empty response to return Attendees
            var getAttendeesResponse = $q.defer();
            getAttendeesResponse.resolve({});
            AttendeeService.getAttendees.andReturn(getAttendeesResponse.promise);

            // The Event previously selected
            var selectedEvent = {
                EventID: 1
            };
            $scope.selectedEvent = selectedEvent;

            $scope.$digest();
            $scope.selectEvent();

            expect($scope.selectedEvent).toBeUndefined();
        });
    });

    describe('when the user clicks the New button', function() {

        beforeEach(function() {

            // Mock getEvents response
            var getEventsResponse = $q.defer();
            getEventsResponse.resolve(
                [{
                    "EventID": 1,
                    "Name": "New Event",
                    "Hashtag": "newevent",
                    "StartDate": "2014-04-20T08:54:11.75",
                    "EndDate": "2014-10-22T08:54:11.75",
                    "CreatorID": 1,
                    "Description": "Description",
                    "DateDescription": "Today",
                    "DisplayDate": "20 Apr to 22 Oct 2014"
                }, {
                    "EventID": 2,
                    "Name": "Another New Event",
                    "Hashtag": "anotherevent",
                    "StartDate": "2014-04-20T08:54:11.953",
                    "EndDate": "2014-10-22T08:54:11.953",
                    "CreatorID": 1,
                    "Description": "Description",
                    "DateDescription": "Today",
                    "DisplayDate": "20 Apr to 22 Oct 2014"
                }]
            );
            EventService.getEvents.andReturn(getEventsResponse.promise);

            // Set the authenticated Profile 
            $window.sessionStorage.profile = JSON.stringify({
                "ProfileID": 2,
                "Name": "New Profile 635323921079431766",
                "ProfilePictureUri": "http://graph.facebook.com/635323921079431766/picture",
                "FacebookID": "635323921079431766",
                "FacebookProfileUri": "http://www.facebook.com/635323921079431766",
                "Email": "bradley@yieldto.me",
                "EmailToUri": "mailto://bradley@yieldto.me",
                "Phone": "555 125-3459",
                "Twitter": "tweettome",
                "TwitterProfileUri": "http://twitter.com/tweettome",
                "LinkedIn": "linktome",
                "LinkedinProfileUri": "http://www.linkedin.com/in/linktome",
                "IsFacebookPublic": true,
                "IsEmailPublic": true,
                "IsPhonePublic": false,
                "IsTwitterPublic": false,
                "IsLinkedInPublic": true
            });

            // Initialise the controller
            $controller('Events', {
                $scope: $scope,
                $location: $location,
                $log: $log,
                $window: $window,
                EventService: EventService,
                AttendeeService: AttendeeService
            });

        });

        it("it should rediect to createEvent", function() {
            $scope.new();
            expect($location.path).toHaveBeenCalledWith("/createEvent"); // Check redirection
        });
    });

    describe('when the user clicks the Attend button', function() {

        beforeEach(function() {

            // Mock getEvents response
            var getEventsResponse = $q.defer();
            getEventsResponse.resolve(
                [{
                    "EventID": 1,
                    "Name": "New Event",
                    "Hashtag": "newevent",
                    "StartDate": "2014-04-20T08:54:11.75",
                    "EndDate": "2014-10-22T08:54:11.75",
                    "CreatorID": 1,
                    "Description": "Description",
                    "DateDescription": "Today",
                    "DisplayDate": "20 Apr to 22 Oct 2014"
                }, {
                    "EventID": 2,
                    "Name": "Another New Event",
                    "Hashtag": "anotherevent",
                    "StartDate": "2014-04-20T08:54:11.953",
                    "EndDate": "2014-10-22T08:54:11.953",
                    "CreatorID": 1,
                    "Description": "Description",
                    "DateDescription": "Today",
                    "DisplayDate": "20 Apr to 22 Oct 2014"
                }]
            );
            EventService.getEvents.andReturn(getEventsResponse.promise);

            // Set the authenticated Profile 
            $window.sessionStorage.profile = JSON.stringify({
                "ProfileID": 2,
                "Name": "New Profile 635323921079431766",
                "ProfilePictureUri": "http://graph.facebook.com/635323921079431766/picture",
                "FacebookID": "635323921079431766",
                "FacebookProfileUri": "http://www.facebook.com/635323921079431766",
                "Email": "bradley@yieldto.me",
                "EmailToUri": "mailto://bradley@yieldto.me",
                "Phone": "555 125-3459",
                "Twitter": "tweettome",
                "TwitterProfileUri": "http://twitter.com/tweettome",
                "LinkedIn": "linktome",
                "LinkedinProfileUri": "http://www.linkedin.com/in/linktome",
                "IsFacebookPublic": true,
                "IsEmailPublic": true,
                "IsPhonePublic": false,
                "IsTwitterPublic": false,
                "IsLinkedInPublic": true
            });

            // Initialise the controller
            $controller('Events', {
                $scope: $scope,
                $location: $location,
                $log: $log,
                $window: $window,
                EventService: EventService,
                AttendeeService: AttendeeService
            });

        });

        it("it should rediect to attend", function() {
            var event = {
                    "EventID": 1,
                    "Name": "New Event",
                    "Hashtag": "newevent",
                    "StartDate": "2014-04-20T08:54:11.75",
                    "EndDate": "2014-10-22T08:54:11.75",
                    "CreatorID": 1,
                    "Description": "Description",
                    "DateDescription": "Today",
                    "DisplayDate": "20 Apr to 22 Oct 2014"
                };

            $scope.selectedEvent = event;
            $scope.attend();

            expect($location.path).toHaveBeenCalledWith("/attend"); // Check redirection
            expect($window.sessionStorage.event).toBe(JSON.stringify(event)); // Check save of event to session
        });
    });

});
