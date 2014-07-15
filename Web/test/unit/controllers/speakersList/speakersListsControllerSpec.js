'use strict';

describe('The SpeakersLists controller', function() {

    var $controller, $log, $scope, $location, $q, SessionService, SpeakersListService;

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
            SpeakersListService = jasmine.createSpyObj('SpeakersListService', ['getLists']);
        });
    });

    function initializeController(){
        // Initialise the controller
        //  $scope, $location, $log, $window, SessionService, SpeakersListService
        $controller('SpeakersLists', {
            $scope: $scope,
            $location: $location,
            $log: $log,
            SessionService: SessionService,
            SpeakersListService: SpeakersListService
        });
    }

    describe('when it initiaties', function() {
        it("should display an error to screen if an Event isn't found in session", function() {
            
            SessionService.set('event', undefined);
            initializeController();
            $scope.$digest();

            expect($scope.error).toBe("We don't know what Event you're attending");
        });

        it("should get the Speakers lists and displays them to screen", function() {
            
            // Save an Event in session
            SessionService.set('event', 'ValidEvent');

            // Mock getLists response
            var getListsResponse = $q.defer();
            getListsResponse.resolve([{
                "SpeakersListID": 1,
                "Name": "Starting Speakers list",
                "Status": "Open",
                "CreatorID": 1,
                "NextSpeaker": {
                    "SpeakerID": 1,
                    "Position": "For",
                    "Attendee": {
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
                    }
                },
                "NumberOfSpeakers": 2
            },
            {
                "SpeakersListID": 2,
                "Name": "Another Speakers list",
                "Status": "Open",
                "CreatorID": 1,
                "NextSpeaker": null,
                "NumberOfSpeakers": 0
            }]);

            SpeakersListService.getLists.andReturn(getListsResponse.promise);
            initializeController();
            $scope.$digest();

            expect($scope.lists.length).toBe(2);
        });

        it("should display an error if there was a huge fail when trying to get the Speakers lists", function() {

            // Save an Event in session
            SessionService.set('event', 'ValidEvent');

            // Mock getLists error
            var getListsResponse = $q.defer();
            getListsResponse.reject('HugeFail');
            SpeakersListService.getLists.andReturn(getListsResponse.promise);

            initializeController();
            $scope.$digest();

            expect($scope.error).toBe("Something went wrong trying to get the list of Speakers Lists");
        });
    });
});