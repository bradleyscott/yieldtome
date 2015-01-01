'use strict';

describe('The Attendees controller', function() {

    var $controller, $log, $scope, $location, $q, growl, SessionService, AttendeeService, ChatService;

    beforeEach(function() {
        module('yieldtome.services');
        module('yieldtome.controllers');

        inject(function($rootScope, _$log_, _$controller_, _$q_, _$location_, _SessionService_) {
            $scope = $rootScope.$new();
            $q = _$q_;
            $controller = _$controller_;
            $log = _$log_;
            $location = _$location_;
            SessionService = _SessionService_;

            // Create Mocks 
            $location = jasmine.createSpyObj('$location', ['path']);
            AttendeeService = jasmine.createSpyObj('AttendeeService', ['getAttendees']);
            ChatService = jasmine.createSpyObj('ChatService', ['subscribeToMessages', 'getMesages', 'sendMessage']);
            growl = jasmine.createSpyObj('growl', ['addInfoMessage', 'addErrorMessage']);
        });
    });

    function initializeController() {
        // Initialise the controller
        // $scope, $log, $location, growl, SessionService, AttendeeService
        $controller('Attendees', {
            $scope: $scope,
            $log: $log,
            $location: $location,
            growl: growl,
            SessionService: SessionService,
            AttendeeService: AttendeeService,
            ChatService: ChatService
        });        
    }

    describe('when it initiaties', function() {
        it("should display an error to screen if an Event isn't found in session", function() {
            
            SessionService.set('event', undefined);
            SessionService.set('profile', { ProfileID: 1 });
            SessionService.set('attendee', { AttendeeID: 1 });

            initializeController();

            expect(growl.addErrorMessage).toHaveBeenCalledWith("We don't know what Event you're attending");
        });

        it("should get the Attendees and display them to screen", function() {
            
            // Save an Event in session
            SessionService.set('event', 'ValidEvent');
            SessionService.set('profile', { ProfileID: 1 });
            SessionService.set('attendee', { AttendeeID: 1 });

            // Mock getPolls response
            var getAttendeesResponse = $q.defer();
            getAttendeesResponse.resolve([
                {
                "AttendeeID": 1,
                "Name": "Starting Attendee",
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
                },
                {
                "AttendeeID": 2,
                "Name": "Starting Attendee",
                "Profile": {
                    "ProfileID": 2,
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
                }
            ]);

            AttendeeService.getAttendees.andReturn(getAttendeesResponse.promise);
            initializeController();
            $scope.$digest();

            expect($scope.attendees.length).toBe(1);
        });

        it("should display an error if there was a huge fail when trying to get Attendees", function() {

            // Save an Event in session
            SessionService.set('event', 'ValidEvent');
            SessionService.set('profile', { ProfileID: 1 });
            SessionService.set('attendee', { AttendeeID: 1 });

            // Mock getPolls error
            var getAttendeesResponse = $q.defer();
            getAttendeesResponse.reject('HugeFail');
            AttendeeService.getAttendees.andReturn(getAttendeesResponse.promise);
            initializeController();
            $scope.$digest();

            expect(growl.addErrorMessage).toHaveBeenCalledWith("Something went wrong trying to get the list of Attendees");
        });
    });
});