'use strict';

describe('The EditPoll controller', function() {

    var $scope, $location, $q, $controller, $log, $window, $modal, $routeParams, $filter, PollService, SessionService;

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
            PollService = jasmine.createSpyObj('PollService', ['getPoll', 'updatePoll', 'deletePoll']);
            $location = jasmine.createSpyObj('$location', ['path']);
            $modal = jasmine.createSpyObj('$modal', ['open']);
        });
    });

     function initializeController(){

        // $scope, $location, $log, $window, $modal, $routeParams, SessionService, PollService
        // Initialise the controller
        $controller('EditPoll', {
            $scope: $scope,
            $location: $location,
            $log: $log,
            $window: $window,
            $modal: $modal,
            $routeParams: $routeParams,
            SessionService: SessionService,
            PollService: PollService
        }); 
    }

    describe('when initializing', function() {

        it("it should retrieve the PollID from the URL and display the relevent Poll", function() {
            // Set the ID in the url 
            $routeParams = { pollID: 1 };

            // Set up Mock behaviour to support Controler initialization
            var getPollResponse = $q.defer();
            getPollResponse.resolve('AwesomePoll');

            PollService.getPoll.andReturn(getPollResponse.promise); // Return a valid event

            initializeController();
            $scope.$digest();

            expect($scope.poll).toBe('AwesomePoll');
        });

        it("that should display an error to screen if something catastrophic happens", function() {
            // Set the ID in the url 
            $routeParams = { pollID: 1 };

            // Set up Mock behaviour to support Controler initialization
            var getPollResponse = $q.defer();
            getPollResponse.reject('EpicFail');

            PollService.getPoll.andReturn(getPollResponse.promise); // Return invalid event

            initializeController();
            $scope.$digest();

            expect($scope.error).toBe("Something went wrong trying to get this Poll");
        });
    });

    describe('should have a save() function', function() {

        beforeEach(function() {
            // Set the ID in the url 
            $routeParams = { pollID: 1 };

            // Set up Mock behaviour to support Controler initialization
            var getPollResponse = $q.defer();
            getPollResponse.resolve('AwesomeEvent');

            PollService.getPoll.andReturn(getPollResponse.promise);

            initializeController();
        });
    
        it("that should display a confirmation to screen if Event edits succeed", function() {

            // Set up Mock behaviour to support Controler initialization
            var editPollResponse = $q.defer();
            editPollResponse.resolve();

            PollService.updatePoll.andReturn(editPollResponse.promise);

            $scope.save();
            $scope.$digest();

            expect($scope.info).toBe('Your Poll updates just got saved');
        });

        it("that displays an error if something catastrophic happens", function() {

            // Set up Mock behaviour to support Controler initialization
            var editPollResponse = $q.defer();
            editPollResponse.reject('EpicFail');

            PollService.updatePoll.andReturn(editPollResponse.promise);

            $scope.save();
            $scope.$digest();

            expect($scope.error).toBe("Something went wrong trying to edit your Poll. EpicFail");
        });
    });

    describe('should have a delete() function', function() {

        beforeEach(function() {
            // Set the ID in the url 
            $routeParams = { pollID: 1 };

            // Set up Mock behaviour to support Controler initialization
            var getPollResponse = $q.defer();
            getPollResponse.resolve('AwesomePoll');

            PollService.getPoll.andReturn(getPollResponse.promise); // Return a valid event
            initializeController();
        });
    
        it("that should return to the events screen if the delete succeeds", function() {

            // Set up Mock behaviour to support Controler initialization
            var deletePollResponse = $q.defer();
            deletePollResponse.resolve();

            PollService.deletePoll.andReturn(deletePollResponse.promise); // Return a valid delete

            $scope.delete();
            $scope.$digest();

            expect($location.path).toHaveBeenCalledWith("/polls"); // Check redirection to eventList
        });

        it("that displays an error if something catastrophic happens", function() {

            // Set up Mock behaviour to support Controler initialization
            var deletePollResponse = $q.defer();
            deletePollResponse.reject('EpicFail');

            PollService.deletePoll.andReturn(deletePollResponse.promise); // Return an error

            $scope.delete();
            $scope.$digest();

            expect($scope.error).toBe("Something went wrong trying to delete your Poll. EpicFail");
        });
    });

});
