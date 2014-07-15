'use strict';

describe('The Polls controller', function() {

    var $controller, $log, $scope, $location, $q, SessionService, PollService;

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
            PollService = jasmine.createSpyObj('PollService', ['getPolls']);
        });
    });

    function initializeController() {
        // Initialise the controller
        //  $scope, $location, $log, $window, SessionService, PollService
        $controller('Polls', {
            $scope: $scope,
            $location: $location,
            $log: $log,
            SessionService: SessionService,
            PollService: PollService
        });        
    }

    describe('when it initiaties', function() {
        it("should display an error to screen if an Event isn't found in session", function() {
            
            SessionService.set('event', undefined);
            initializeController();
            $scope.$digest();

            expect($scope.error).toBe("We don't know what Event you're attending");
        });

        it("should get the Polls and display them to screen", function() {
            
            // Save an Event in session
            SessionService.set('event', 'ValidEvent');

            // Mock getPolls response
            var getPollsResponse = $q.defer();
            getPollsResponse.resolve([
                {
                    "PollID": 1,
                    "Name": "Starting Poll",
                    "Status": "Open",
                    "Type": "ForMoreThanAgainstAndAbstain",
                    "CreatorID": 1,
                    "VotesFor": 3,
                    "VotesAgainst": 1,
                    "VotesAbstaining": 0,
                    "MajorityRequired": 50,
                    "IsPassing": true
                },
                {
                    "PollID": 2,
                    "Name": "Another Poll",
                    "Status": "Open",
                    "Type": "ForMoreThanAgainstAndAbstain",
                    "CreatorID": 1,
                    "VotesFor": 0,
                    "VotesAgainst": 0,
                    "VotesAbstaining": 4,
                    "MajorityRequired": 50,
                    "IsPassing": false
                }
            ]);

            PollService.getPolls.andReturn(getPollsResponse.promise);
            initializeController();
            $scope.$digest();

            expect($scope.polls.length).toBe(2);
        });

        it("should display an error if there was a huge fail when trying to get Polls", function() {

            // Save an Event in session
            SessionService.set('event', 'ValidEvent');

            // Mock getPolls error
            var getPollsResponse = $q.defer();
            getPollsResponse.reject('HugeFail');
            PollService.getPolls.andReturn(getPollsResponse.promise);
            initializeController();
            $scope.$digest();

            expect($scope.error).toBe("Something went wrong trying to get the list of Polls");
        });
    });
});