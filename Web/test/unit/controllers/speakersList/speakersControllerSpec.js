'use strict';

describe('The Speakers controller', function() {

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
            SpeakersListService = jasmine.createSpyObj('SpeakersListService', ['getList', 'getSpeakers', 'speakerHasSpoken', 'deleteSpeaker', 'reorderSpeakers']);
        });

        beforeEach(function() {
            // Save required variables in session
            SessionService.set('profile', 'ValidProfile');
            SessionService.set('event', 'ValidEvent');
            SessionService.set('attendee', 'ValidAttendee');
        });
    });

    describe('when it initiaties', function() {

        it("should display an error if there was a problem trying to get the Speakers list", function() {

            // Set the speakersListID in the url 
            var $routeParams = {
                speakersListID: 1
            };

            // Set up Mock behaviour to support Controler initialization
            var getListResponse = $q.defer();
            getListResponse.reject('EpicFail');
            SpeakersListService.getList.andReturn(getListResponse.promise);

            // Initialise the controller
            //  $scope, $location, $log, $window, SessionService, SpeakersListService
            $controller('Speakers', {
                $scope: $scope,
                $location: $location,
                $log: $log,
                $routeParams: $routeParams,
                SessionService: SessionService,
                SpeakersListService: SpeakersListService
            });

            $scope.$digest();
            expect($scope.error).toBe("Something wen't wrong trying to get this Speakers List");

        });

        it("should display an error if there was a problem trying to get the list of Speakers", function() {

            // Set the speakersListID in the url 
            var $routeParams = {
                speakersListID: 1
            };

            // Set up Mock behaviour to support Controler initialization
            var getListResponse = $q.defer();
            getListResponse.resolve([{
                SpeakersListID: 1
            }]);
            SpeakersListService.getList.andReturn(getListResponse.promise);

            var getSpeakersResponse = $q.defer();
            getSpeakersResponse.reject('EpicFail');
            SpeakersListService.getSpeakers.andReturn(getSpeakersResponse.promise);

            // Initialise the controller
            //  $scope, $location, $log, $window, SessionService, SpeakersListService
            $controller('Speakers', {
                $scope: $scope,
                $location: $location,
                $log: $log,
                $routeParams: $routeParams,
                SessionService: SessionService,
                SpeakersListService: SpeakersListService
            });

            $scope.$digest();
            expect($scope.error).toBe("Something wen't wrong trying to get the list of Speakers");
        });

        it("should display the Speakers to screen", function() {
            // Set the speakersListID in the url 
            var $routeParams = {
                speakersListID: 1
            };

            // Set up Mock behaviour to support Controler initialization
            var getListResponse = $q.defer();
            getListResponse.resolve([{
                SpeakersListID: 1
            }]);
            SpeakersListService.getList.andReturn(getListResponse.promise);

            var getSpeakersResponse = $q.defer();
            getSpeakersResponse.resolve('LotsOfSpeakers');
            SpeakersListService.getSpeakers.andReturn(getSpeakersResponse.promise);

            // Initialise the controller
            //  $scope, $location, $log, $window, SessionService, SpeakersListService
            $controller('Speakers', {
                $scope: $scope,
                $location: $location,
                $log: $log,
                $routeParams: $routeParams,
                SessionService: SessionService,
                SpeakersListService: SpeakersListService
            });

            $scope.$digest();
            expect($scope.speakers).toBe('LotsOfSpeakers');
        });

    });

    describe('should have a function called', function() {

        beforeEach(function() {

            // Set the speakersListID in the url 
            var $routeParams = {
                speakersListID: 1
            };

            // Set up Mock behaviour to support Controler initialization
            var getListResponse = $q.defer();
            getListResponse.resolve([{
                SpeakersListID: 1
            }]);
            SpeakersListService.getList.andReturn(getListResponse.promise);

            var getSpeakersResponse = $q.defer();
            getSpeakersResponse.resolve('LotsOfSpeakers');
            SpeakersListService.getSpeakers.andReturn(getSpeakersResponse.promise);

            // Initialise the controller
            //  $scope, $location, $log, $window, SessionService, SpeakersListService
            $controller('Speakers', {
                $scope: $scope,
                $location: $location,
                $log: $log,
                $routeParams: $routeParams,
                SessionService: SessionService,
                SpeakersListService: SpeakersListService
            });

            $scope.$digest();
        });

        describe('speak()', function() {


            it("that updates the SpeakersList and displays the update to screen", function() {
                var speakerHasSpokenResponse = $q.defer();
                speakerHasSpokenResponse.resolve('LotsOfSpeakers');

                SpeakersListService.speakerHasSpoken.andReturn(speakerHasSpokenResponse.promise);

                $scope.speak();
                $scope.$digest();

                expect($scope.speakers).toBe('LotsOfSpeakers');
                expect($scope.info).toBe('Speaker has now spoken and has been removed');
            });

            it("that displays an error if something catastrophic happens", function() {
                var speakerHasSpokenResponse = $q.defer();
                speakerHasSpokenResponse.reject('EpicFail');

                SpeakersListService.speakerHasSpoken.andReturn(speakerHasSpokenResponse.promise); // Return an error

                $scope.speak();
                $scope.$digest();

                expect($scope.error).toBe("Something wen't wrong trying to update the Speakers list");
            });
        });

        describe('remove()', function() {

            it("that updates the SpeakersList and displays the update to screen", function() {
                var deleteSpeakerResponse = $q.defer();
                deleteSpeakerResponse.resolve('LotsOfSpeakers');

                SpeakersListService.deleteSpeaker.andReturn(deleteSpeakerResponse.promise);

                $scope.remove();
                $scope.$digest();

                expect($scope.speakers).toBe('LotsOfSpeakers');
                expect($scope.info).toBe('Speaker removed');

            });

            it("that displays an error if something catastrophic happens", function() {
                var deleteSpeakerResponse = $q.defer();
                deleteSpeakerResponse.reject('EpicFail');

                SpeakersListService.deleteSpeaker.andReturn(deleteSpeakerResponse.promise); // Return an error

                $scope.remove();
                $scope.$digest();

                expect($scope.error).toBe("Something wen't wrong trying to remove this Speaker");
            });
        });

        describe('reorderSpeakers()', function() {

            it("that updates the SpeakersList and displays the update to screen", function() {
                var reorderSpeakersResponse = $q.defer();
                reorderSpeakersResponse.resolve('LotsOfSpeakers');

                SpeakersListService.reorderSpeakers.andReturn(reorderSpeakersResponse.promise);

                $scope.reorderSpeakers();
                $scope.$digest();

                expect($scope.speakers).toBe('LotsOfSpeakers');
                expect($scope.info).toBe('Speakers list re-ordered');

            });

            it("that displays an error if something catastrophic happens", function() {
                var reorderSpeakersResponse = $q.defer();
                reorderSpeakersResponse.reject('EpicFail');

                SpeakersListService.reorderSpeakers.andReturn(reorderSpeakersResponse.promise); // Return an error

                $scope.reorderSpeakers();
                $scope.$digest();

                expect($scope.error).toBe("Something wen't wrong trying to re-order the Speakers list");
            });
        });
    });
});
