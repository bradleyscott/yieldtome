'use strict';

describe('The Attend controller', function() {

    var $scope, $location, $log, $controller, $q, SessionService, AttendeeService;

    beforeEach(function() {
        module('yieldtome.services');
        module('yieldtome.controllers');

        // $scope, $location, $log, $window, AttendeeService
        inject(function($rootScope, _$log_, _$controller_, _$q_, _SessionService_) {
            $scope = $rootScope.$new();
            $log = _$log_;
            $controller = _$controller_;
            $q = _$q_;
            SessionService = _SessionService_;

            // Create Mocks 
            AttendeeService = jasmine.createSpyObj('AttendeeService', ['attendEvent']);
            $location = jasmine.createSpyObj('$location', ['path']);

        });
    });

    describe('when it initializes', function() {

        it("should display an error if the Profile or Event aren't in session", function() {
            SessionService.set('profile', undefined);
            SessionService.set('event', undefined);

            // Initialise the controller
            $controller('Attend', {
                $scope: $scope,
                $location: $location,
                $log: $log,
                SessionService: SessionService,
                AttendeeService: AttendeeService
            });

            expect($scope.error).toBe("We don't have enough information to have you attend this event");
        });

        it("should set the profile and event properties if the correct values are in session", function() {
            
            SessionService.set('profile', 'ValidProfile');
            SessionService.set('event', 'ValidEvent');

            // Initialise the controller
            $controller('Attend', {
                $scope: $scope,
                $location: $location,
                $log: $log,
                SessionService: SessionService,
                AttendeeService: AttendeeService
            });

            expect($scope.profile).toBe('ValidProfile');
            expect($scope.event).toBe('ValidEvent');
            expect($scope.error).toBeUndefined();
        });
    });

    describe('should have a save() function', function() {

        beforeEach(function() {
            
            SessionService.set('profile', 'ValidProfile');
            SessionService.set('event', 'ValidEvent');

            // Initialise the controller
            $controller('Attend', {
                $scope: $scope,
                $location: $location,
                $log: $log,
                SessionService: SessionService,
                AttendeeService: AttendeeService
            });
        });

        it("that should redirect to landing page if successful, and save th Attendee to session", function() {

            // Set up Mock behaviour
            var attendEventResponse = $q.defer();
            attendEventResponse.resolve('ValidAttendee');

            AttendeeService.attendEvent.andReturn(attendEventResponse.promise); // Return a valid attendee

            $scope.save();
            $scope.$digest();

            var attendee = SessionService.get('attendee');
            expect(attendee).toBe('ValidAttendee');
            expect($location.path).toHaveBeenCalledWith("/landing"); // Check redirection
        });

        it("that displays an error if something catastrophic happens", function() {

            // Set up Mock behaviour
            var attendEventResponse = $q.defer();
            attendEventResponse.reject({ 
                Message: 'EpicFail' 
            });

            AttendeeService.attendEvent.andReturn(attendEventResponse.promise);

            $scope.save();
            $scope.$digest();

            expect($scope.error).toBe("Something went wrong trying to attend this Event. EpicFail");
        });
    });
});
