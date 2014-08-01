'use strict';

describe('The Speakers controller', function() {

    var $controller, $log, $scope, $location, $q, growl, SessionService, SpeakersListService, SpeakersService;

    var speaker = {
                "SpeakerID": 28,
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
            };

    var speakers = [speaker];

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
        SessionService.set('attendee', { AttendeeID: 1 });

        // Initialise the controller
        $controller('Speakers', {
            $scope: $scope,
            $location: $location,
            $log: $log,
            $routeParams: $routeParams,
            growl: growl,
            SessionService: SessionService,
            SpeakersListService: SpeakersListService,
            SpeakersService: SpeakersService
        });
    }

    describe('when it initiaties', function() {

        it("should display an error if there was a problem trying to get the Speakers list", function() {

            // Set up Mock behaviour to support Controler initialization
            var getListResponse = $q.defer();
            getListResponse.reject('EpicFail');
            SpeakersListService.getList.andReturn(getListResponse.promise);

            initializeController();

            $scope.$digest();
            expect(growl.addErrorMessage).toHaveBeenCalledWith("Something went wrong trying to get this Speakers List");

        });

        it("should display an error if there was a problem trying to get the list of Speakers", function() {

            // Set up Mock behaviour to support Controler initialization
            var getListResponse = $q.defer();
            getListResponse.resolve([{
                SpeakersListID: 1
            }]);
            SpeakersListService.getList.andReturn(getListResponse.promise);

            var getSpeakersResponse = $q.defer();
            getSpeakersResponse.reject('EpicFail');
            SpeakersService.getSpeakers.andReturn(getSpeakersResponse.promise);

            initializeController();

            $scope.$digest();
            expect(growl.addErrorMessage).toHaveBeenCalledWith("Something went wrong trying to get the list of Speakers");
        });

        it("should display the Speakers to screen", function() {

            // Set up Mock behaviour to support Controler initialization
            var getListResponse = $q.defer();
            getListResponse.resolve([{
                SpeakersListID: 1
            }]);
            SpeakersListService.getList.andReturn(getListResponse.promise);

            var getSpeakersResponse = $q.defer();
            getSpeakersResponse.resolve(speakers);

            SpeakersService.getSpeakers.andReturn(getSpeakersResponse.promise);
            initializeController();

            $scope.$digest();
            expect($scope.speakers).toBe(speakers);
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

            var getSpeakersResponse = $q.defer();
            getSpeakersResponse.resolve(speakers);

            SpeakersService.getSpeakers.andReturn(getSpeakersResponse.promise);
            initializeController();
            $scope.$digest();
        });

        describe('add()', function() {

            it("that add a Speaker to the Speakers list", function() {
                var createSpeakerResponse = $q.defer();
                createSpeakerResponse.resolve('Speaker');

                SpeakersService.createSpeaker.andReturn(createSpeakerResponse.promise);

                $scope.add('Position');
                $scope.$digest();

                expect(growl.addInfoMessage).toHaveBeenCalledWith('You have been added to the Speakers List');
            });

            it("that displays an error if something catastrophic happens", function() {
                var createSpeakerResponse = $q.defer();
                createSpeakerResponse.reject('EpicFail');

                SpeakersService.createSpeaker.andReturn(createSpeakerResponse.promise); // Return an error

                $scope.add('Position');
                $scope.$digest();

                expect(growl.addErrorMessage).toHaveBeenCalledWith("Something went wrong trying to add you to the Speakers List");
            });
        });

        describe('openList()', function() {

            it("that opens the Speakers list status", function() {
                var updateListResponse = $q.defer();
                updateListResponse.resolve({
                    Name: 'List 1',
                    Status: 'Open'
                });

                SpeakersListService.updateList.andReturn(updateListResponse.promise);

                $scope.openList();
                $scope.$digest();

                expect($scope.list.Status).toBe('Open');
                expect(growl.addInfoMessage).toHaveBeenCalledWith('List 1 opened to new Speakers');
            });

            it("that displays an error if something catastrophic happens", function() {
                var updateListResponse = $q.defer();
                updateListResponse.reject('EpicFail');

                SpeakersListService.updateList.andReturn(updateListResponse.promise); // Return an error

                $scope.list = { Name: 'List 1' };
                $scope.openList();
                $scope.$digest();

                expect(growl.addErrorMessage).toHaveBeenCalledWith("Something went wrong trying to open List 1 to new Speakers");
            });
        });

        describe('closeList()', function() {

            it("that closes the Speakers list status", function() {
                var updateListResponse = $q.defer();
                updateListResponse.resolve({
                    Name: 'List 1',
                    Status: 'Closed'
                });

                SpeakersListService.updateList.andReturn(updateListResponse.promise);

                $scope.closeList();
                $scope.$digest();

                expect($scope.list.Status).toBe('Closed');
                expect(growl.addInfoMessage).toHaveBeenCalledWith('List 1 closed to new Speakers');
            });

            it("that displays an error if something catastrophic happens", function() {
                var updateListResponse = $q.defer();
                updateListResponse.reject('EpicFail');

                SpeakersListService.updateList.andReturn(updateListResponse.promise); // Return an error

                $scope.list = { Name: 'List 1' };
                $scope.closeList();
                $scope.$digest();

                expect(growl.addErrorMessage).toHaveBeenCalledWith("Something went wrong trying to close List 1 to new Speakers");
            });
        });

        describe('removeAllSpeakers()', function() {

            it("that removes all Speakers from the SpeakersList and displays the update to screen", function() {
                var deleteAllSpeakersResponse = $q.defer();
                deleteAllSpeakersResponse.resolve([]);

                SpeakersService.deleteAllSpeakers.andReturn(deleteAllSpeakersResponse.promise);

                $scope.removeAllSpeakers();
                $scope.$digest();

                expect($scope.speakers.length).toBe(0);
                expect(growl.addInfoMessage).toHaveBeenCalledWith('Speakers have all been removed');
            });

            it("that displays an error if something catastrophic happens", function() {
                var deleteAllSpeakersResponse = $q.defer();
                deleteAllSpeakersResponse.reject('EpicFail');

                SpeakersService.deleteAllSpeakers.andReturn(deleteAllSpeakersResponse.promise); // Return an error

                $scope.removeAllSpeakers();
                $scope.$digest();

                expect(growl.addErrorMessage).toHaveBeenCalledWith("Something went wrong trying to remove the Speakers from this Speakers list");
            });
        });

        describe('remove()', function() {

            it("that removes a Speaker, and updates the SpeakersList and displays the update to screen", function() {
                var deleteSpeakerResponse = $q.defer();
                deleteSpeakerResponse.resolve(speakers);

                SpeakersService.deleteSpeaker.andReturn(deleteSpeakerResponse.promise);

                $scope.remove(speaker);
                $scope.$digest();

                expect($scope.speakers).toBe(speakers);
                expect(growl.addInfoMessage).toHaveBeenCalledWith('Starting Attendee removed');
            });

            it("that displays an error if something catastrophic happens", function() {
                var speakerHasSpokenResponse = $q.defer();
                speakerHasSpokenResponse.reject('EpicFail');

                SpeakersService.speakerHasSpoken.andReturn(speakerHasSpokenResponse.promise); // Return an error

                $scope.speak();
                $scope.$digest();

                expect(growl.addErrorMessage).toHaveBeenCalledWith("Something went wrong trying to update the Speakers list");
            });
        });

        describe('speak()', function() {

            it("that updates the SpeakersList and displays the update to screen", function() {
                var speakerHasSpokenResponse = $q.defer();
                speakerHasSpokenResponse.resolve(speakers);

                SpeakersService.speakerHasSpoken.andReturn(speakerHasSpokenResponse.promise);

                $scope.speak(speaker);
                $scope.$digest();

                expect($scope.speakers).toBe(speakers);
                expect(growl.addInfoMessage).toHaveBeenCalledWith('Starting Attendee has now spoken and has been removed');
            });

            it("that displays an error if something catastrophic happens", function() {
                var speakerHasSpokenResponse = $q.defer();
                speakerHasSpokenResponse.reject('EpicFail');

                SpeakersService.speakerHasSpoken.andReturn(speakerHasSpokenResponse.promise); // Return an error

                $scope.speak();
                $scope.$digest();

                expect(growl.addErrorMessage).toHaveBeenCalledWith("Something went wrong trying to update the Speakers list");
            });
        });

        describe('remove()', function() {

            it("that updates the SpeakersList and displays the update to screen", function() {
                var deleteSpeakerResponse = $q.defer();
                deleteSpeakerResponse.resolve(speakers);

                SpeakersService.deleteSpeaker.andReturn(deleteSpeakerResponse.promise);

                $scope.remove(speaker);
                $scope.$digest();

                expect($scope.speakers).toBe(speakers);
                expect(growl.addInfoMessage).toHaveBeenCalledWith('Starting Attendee removed');

            });

            it("that displays an error if something catastrophic happens", function() {
                var deleteSpeakerResponse = $q.defer();
                deleteSpeakerResponse.reject('EpicFail');

                SpeakersService.deleteSpeaker.andReturn(deleteSpeakerResponse.promise); // Return an error

                $scope.remove();
                $scope.$digest();

                expect(growl.addErrorMessage).toHaveBeenCalledWith("Something went wrong trying to remove this Speaker");
            });
        });

        describe('reorderSpeakers()', function() {

            it("that updates the SpeakersList and displays the update to screen", function() {
                var reorderSpeakersResponse = $q.defer();
                reorderSpeakersResponse.resolve(speakers);

                SpeakersService.reorderSpeakers.andReturn(reorderSpeakersResponse.promise);

                $scope.reorderSpeakers();
                $scope.$digest();

                expect($scope.speakers).toBe(speakers);
                expect(growl.addInfoMessage).toHaveBeenCalledWith('Speakers list re-ordered');

            });

            it("that displays an error if something catastrophic happens", function() {
                var reorderSpeakersResponse = $q.defer();
                reorderSpeakersResponse.reject('EpicFail');

                SpeakersService.reorderSpeakers.andReturn(reorderSpeakersResponse.promise); // Return an error

                $scope.reorderSpeakers();
                $scope.$digest();

                expect(growl.addErrorMessage).toHaveBeenCalledWith("Something went wrong trying to re-order the Speakers list");
            });
        });
    });
});
