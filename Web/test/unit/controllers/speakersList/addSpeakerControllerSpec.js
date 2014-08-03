'use strict';

describe('The AddSpeaker controller', function() {

    var $controller, $log, $scope, $location, $q, growl, SessionService, SpeakersListService, SpeakersService, AttendeeService;

    var attendee = {
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
    };

    var attendees = [attendee];

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
            SpeakersListService = jasmine.createSpyObj('SpeakersListService', ['getList','updateList', 'deleteList']);
            SpeakersService = jasmine.createSpyObj('SpeakersService', [ 'getSpeakers', 'speakerHasSpoken', 'deleteSpeaker', 'reorderSpeakers', 'deleteAllSpeakers', 'createSpeaker']);
            growl = jasmine.createSpyObj('growl', ['addInfoMessage', 'addErrorMessage']);
        });
    });

    function initializeController() {
        // Set the speakersListID in the url 
        var $routeParams = {
            speakersListID: 1
        };

        // Save required variables in session
        SessionService.set('profile', 'ValidProfile');
        SessionService.set('event', 'ValidEvent');

        // Initialise the controller
        // $scope, $location, $log, $window, $routeParams, growl, SessionService, SpeakersListService, SpeakersService, AttendeeService
        $controller('AddSpeaker', {
            $scope: $scope,
            $location: $location,
            $log: $log,
            $routeParams: $routeParams,
            growl: growl,
            SessionService: SessionService,
            SpeakersListService: SpeakersListService,
            SpeakersService: SpeakersService,
            AttendeeService: AttendeeService
        });
    }

    describe('when it initiaties', function() {

        it("should display an error if there was a problem trying to get the Speakers list", function() {

            // Set up Mock behaviour to support Controler initialization
            var getListResponse = $q.defer();
            getListResponse.reject('EpicFail');
            SpeakersListService.getList.andReturn(getListResponse.promise);

            var getAttendeesResponse = $q.defer();
            getAttendeesResponse.resolve(attendees);
            AttendeeService.getAttendees.andReturn(getAttendeesResponse.promise);

            initializeController();

            $scope.$digest();
            expect(growl.addErrorMessage).toHaveBeenCalledWith("Something went wrong trying to get this Speakers List");

        });

        it("should display an error if there was a problem trying to get the list of Attendees", function() {

            // Set up Mock behaviour to support Controler initialization
            var getListResponse = $q.defer();
            getListResponse.resolve([{
                SpeakersListID: 1
            }]);
            SpeakersListService.getList.andReturn(getListResponse.promise);

            var getAttendeesResponse = $q.defer();
            getAttendeesResponse.reject('EpicFail');
            AttendeeService.getAttendees.andReturn(getAttendeesResponse.promise);

            initializeController();

            $scope.$digest();
            expect(growl.addErrorMessage).toHaveBeenCalledWith("Something went wrong trying to get the list of Attendees");
        });

        it("should display the Attendees to screen", function() {

            // Set up Mock behaviour to support Controler initialization
            var getListResponse = $q.defer();
            getListResponse.resolve([{
                SpeakersListID: 1
            }]);
            SpeakersListService.getList.andReturn(getListResponse.promise);

            var getAttendeesResponse = $q.defer();
            getAttendeesResponse.resolve(attendees);

            AttendeeService.getAttendees.andReturn(getAttendeesResponse.promise);
            initializeController();

            $scope.$digest();   
            expect($scope.attendees).toBe(attendees);
        });

    });

    describe('should have a function called', function() {

        beforeEach(function() {

            // Set up Mock behaviour to support Controler initialization
            var getListResponse = $q.defer();
            getListResponse.resolve([{
                SpeakersListID: 1
            }]);
            SpeakersListService.getList.andReturn(getListResponse.promise);

            var getAttendeesResponse = $q.defer();
            getAttendeesResponse.resolve(attendees);

            AttendeeService.getAttendees.andReturn(getAttendeesResponse.promise);
            initializeController();
            $scope.$digest();
        });

        describe('add()', function() {

            it("that add a Speaker to the Speakers list", function() {
                var createSpeakerResponse = $q.defer();
                createSpeakerResponse.resolve('Speaker');

                SpeakersService.createSpeaker.andReturn(createSpeakerResponse.promise);

                $scope.add(attendee, 'Position');
                $scope.$digest();

                expect(growl.addInfoMessage).toHaveBeenCalledWith('Starting Attendee has been added to the Speakers List speaking Position');
            });

            it("that displays an error if something catastrophic happens", function() {
                var createSpeakerResponse = $q.defer();
                createSpeakerResponse.reject('EpicFail');

                SpeakersService.createSpeaker.andReturn(createSpeakerResponse.promise); // Return an error

                $scope.add(attendee, 'Position');
                $scope.$digest();

                expect(growl.addErrorMessage).toHaveBeenCalledWith("Something went wrong trying to add you to the Speakers List");
            });
        });

        describe('showProfile()', function() {
            it("it should rediect to the View Profile page", function() {
                var profileID = 1;
                $scope.showProfile(profileID);

                expect($location.path).toHaveBeenCalledWith("/viewProfile/1"); // Check redirection
            });

            it("it should do nothing if there is an invalid Profile", function() {
                var profileID;
                $scope.showProfile(profileID);

                expect($location.path.wasCalled).toEqual(false); // Check redirection
            });
        });
    });
});
