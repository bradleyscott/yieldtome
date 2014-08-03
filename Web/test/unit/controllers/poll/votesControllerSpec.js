'use strict';

describe('The Votes controller', function() {

    var $controller, $log, $scope, $location, $q, $routeParams, growl, SessionService, PollService, VotesService;

    var vote = {
        "VoteID": 1,
        "VoteResult": "For",
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

    var votes = [vote];

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
            PollService = jasmine.createSpyObj('PollService', ['getPolls', 'getPoll', 'updatePoll']);
            VotesService = jasmine.createSpyObj('VotesService', ['getVotes', 'createVote', 'deleteAllVotes']);
            growl = jasmine.createSpyObj('growl', ['addInfoMessage', 'addErrorMessage']);
        });
    });

    function initializeController() {
        // Set the speakersListID in the url 
        var $routeParams = {
            pollID: 1
        };

        // Save required variables in session
        SessionService.set('profile', 'ValidProfile');
        SessionService.set('event', 'ValidEvent');
        SessionService.set('attendee', { AttendeeID: 1 });

        $controller('Votes', {
            $scope: $scope,
            $location: $location,
            $log: $log,
            $routeParams: $routeParams,
            growl: growl,
            SessionService: SessionService,
            PollService: PollService,
            VotesService: VotesService
        });        
    }

    describe('when it initiaties', function() {

        it("should display an error if there was a problem trying to get the Poll", function() {

            // Set up Mock behaviour to support Controler initialization
            var getPollResponse = $q.defer();
            getPollResponse.reject('EpicFail');
            PollService.getPoll.andReturn(getPollResponse.promise);

            initializeController();

            $scope.$digest();
            expect(growl.addErrorMessage).toHaveBeenCalledWith("Something went wrong trying to get this Poll");

        });

        it("should display an error if there was a problem trying to get the Votes cast", function() {

            // Set up Mock behaviour to support Controler initialization
            var getPollResponse = $q.defer();
            getPollResponse.resolve([{
                PollID: 1
            }]);
            PollService.getPoll.andReturn(getPollResponse.promise);

            var getVotesResponse = $q.defer();
            getVotesResponse.reject('EpicFail');
            VotesService.getVotes.andReturn(getVotesResponse.promise);

            initializeController();

            $scope.$digest();
            expect(growl.addErrorMessage).toHaveBeenCalledWith("Something went wrong trying to get the Votes on this Poll");
        });

        it("should display the Votes to screen", function() {

            // Set up Mock behaviour to support Controler initialization
            var getPollResponse = $q.defer();
            getPollResponse.resolve([{
                PollID: 1
            }]);
            PollService.getPoll.andReturn(getPollResponse.promise);

            var getVotesResponse = $q.defer();
            getVotesResponse.resolve(votes);

            VotesService.getVotes.andReturn(getVotesResponse.promise);
            initializeController();

            $scope.$digest();
            expect($scope.votes).toBe(votes);
        });

    });

    describe('has a Vote filter function', function() {

        beforeEach(function() {

            // Set up Mock behaviour to support Controler initialization
            var getPollResponse = $q.defer();
            getPollResponse.resolve([{
                PollID: 1
            }]);
            PollService.getPoll.andReturn(getPollResponse.promise);

            var getVotesResponse = $q.defer();
            getVotesResponse.resolve(votes);

            VotesService.getVotes.andReturn(getVotesResponse.promise);
            initializeController();

            $scope.$digest();
        });

        it("that should text match on Attendee name", function() {
            $scope.voteFilter.text = 'Australia';
            $scope.voteFilter.for = true;
            
            var vote = { 
                Attendee: { 
                    Name: 'Australia',
                    Profile: { Name: 'Bradley Scott' }
                },
                VoteResult: 'For'
            };

            var filterResult = $scope.filteredVotes(vote);
            expect(filterResult).toBeTruthy();

            $scope.voteFilter.text = 'Switzerland';
            filterResult = $scope.filteredVotes(vote);
            expect(filterResult).toBeFalsy();
        });

        it("that should text match on Attendee name", function() {
            $scope.voteFilter.text = 'Bradley';
            $scope.voteFilter.for = true;
            
            var vote = { 
                Attendee: { 
                    Name: 'Australia',
                    Profile: { Name: 'Bradley Scott' }
                },
                VoteResult: 'For'
            };

            var filterResult = $scope.filteredVotes(vote);
            expect(filterResult).toBeTruthy();

            $scope.voteFilter.text = 'Simon';
            filterResult = $scope.filteredVotes(vote);
            expect(filterResult).toBeFalsy();
        });

        it("that should match on a For filter", function() {
            $scope.voteFilter.text = '';
            $scope.voteFilter.for = true;
            $scope.voteFilter.against = false;
            $scope.voteFilter.abstain = false;
          
            var vote = { 
                Attendee: { 
                    Name: 'Australia',
                    Profile: { Name: 'Bradley Scott' }
                },
                VoteResult: 'For'
            };

            var filterResult = $scope.filteredVotes(vote);
            expect(filterResult).toBeTruthy();

            $scope.voteFilter.for = false;
            filterResult = $scope.filteredVotes(vote);
            expect(filterResult).toBeFalsy();
        });

        it("that should match on an Against filter", function() {
            $scope.voteFilter.text = '';
            $scope.voteFilter.for = false;
            $scope.voteFilter.against = true;
            $scope.voteFilter.abstain = false;
            
            var vote = { 
                Attendee: { 
                    Name: 'Australia',
                    Profile: { Name: 'Bradley Scott' }
                },
                VoteResult: 'Against'
            };

            var filterResult = $scope.filteredVotes(vote);
            expect(filterResult).toBeTruthy();

            $scope.voteFilter.against = false;
            filterResult = $scope.filteredVotes(vote);
            expect(filterResult).toBeFalsy();
        });

        it("that should match on an Abstain filter", function() {
            $scope.voteFilter.text = '';
            $scope.voteFilter.for = false;
            $scope.voteFilter.against = false;
            $scope.voteFilter.abstain = true;
            
            var vote = { 
                Attendee: { 
                    Name: 'Australia',
                    Profile: { Name: 'Bradley Scott' }
                },
                VoteResult: 'Abstain'
            };

            var filterResult = $scope.filteredVotes(vote);
            expect(filterResult).toBeTruthy();

            $scope.voteFilter.abstain = false;
            filterResult = $scope.filteredVotes(vote);
            expect(filterResult).toBeFalsy();
        });

        it("that should reject otherwise", function() {
            $scope.voteFilter.text = '';
            $scope.voteFilter.for = false;
            $scope.voteFilter.against = false;
            $scope.voteFilter.abstain = false;
            
            var vote = { 
                Attendee: { 
                    Name: 'Australia',
                    Profile: { Name: 'Bradley Scott' }
                },
                VoteResult: 'Abstain'
            };

            var filterResult = $scope.filteredVotes(vote);
            expect(filterResult).toBeFalsy();
        });
    });

    describe('should have a function called', function() {

        beforeEach(function() {

            // Set up Mock behaviour to support Controler initialization
            var getPollResponse = $q.defer();
            getPollResponse.resolve([{
                PollID: 1
            }]);
            PollService.getPoll.andReturn(getPollResponse.promise);

            var getVotesResponse = $q.defer();
            getVotesResponse.resolve(votes);

            VotesService.getVotes.andReturn(getVotesResponse.promise);
            initializeController();

            $scope.$digest();
        });

        describe('castVote()', function() {

            it("that casts a Vote on the Poll", function() {
                var createVoteResponse = $q.defer();
                createVoteResponse.resolve('Vote');

                VotesService.createVote.andReturn(createVoteResponse.promise);

                var attendee = { Name: 'Attendee' };
                $scope.castVote(attendee, 'Position');
                $scope.$digest();

                expect(growl.addInfoMessage).toHaveBeenCalledWith('Attendee has voted Position');
            });

            it("that displays an error if something catastrophic happens", function() {
                var createVoteResponse = $q.defer();
                createVoteResponse.reject('EpicFail');

                VotesService.createVote.andReturn(createVoteResponse.promise); // Return an error

                var attendee = { Name: 'Attendee' };
                $scope.castVote(attendee, 'Position');
                $scope.$digest();

                expect(growl.addErrorMessage).toHaveBeenCalledWith("Something went wrong trying to cast a Vote");
            });
        });

        describe('openPoll()', function() {

            it("that opens the Poll for voting", function() {
                var updatePollResponse = $q.defer();
                updatePollResponse.resolve({
                    Name: 'Poll 1',
                    Status: 'Open'
                });

                PollService.updatePoll.andReturn(updatePollResponse.promise);

                $scope.openPoll();
                $scope.$digest();

                expect($scope.poll.Status).toBe('Open');
                expect(growl.addInfoMessage).toHaveBeenCalledWith('Poll 1 opened for voting');
            });

            it("that displays an error if something catastrophic happens", function() {
                var updatePollResponse = $q.defer();
                updatePollResponse.reject('EpicFail');

                PollService.updatePoll.andReturn(updatePollResponse.promise); // Return an error

                $scope.poll = { Name: 'Poll 1' };
                $scope.openPoll();
                $scope.$digest();

                expect(growl.addErrorMessage).toHaveBeenCalledWith("Something went wrong trying to open Poll 1 for voting");
            });
        });

        describe('closePoll()', function() {

            it("that closes the Poll to voting", function() {
                var updatePollResponse = $q.defer();
                updatePollResponse.resolve({
                    Name: 'Poll 1',
                    Status: 'Closed'
                });

                PollService.updatePoll.andReturn(updatePollResponse.promise);

                $scope.closePoll();
                $scope.$digest();

                expect($scope.poll.Status).toBe('Closed');
                expect(growl.addInfoMessage).toHaveBeenCalledWith('Poll 1 closed to voting');
            });

            it("that displays an error if something catastrophic happens", function() {
                var updatePollResponse = $q.defer();
                updatePollResponse.reject('EpicFail');

                PollService.updatePoll.andReturn(updatePollResponse.promise); // Return an error

                $scope.poll = { Name: 'Poll 1' };
                $scope.closePoll();
                $scope.$digest();

                expect(growl.addErrorMessage).toHaveBeenCalledWith("Something went wrong trying to close Poll 1 to voting");
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

        describe('clearVotes()', function() {

            it("that removes all Votes from the Poll and displays the update to screen", function() {
                var deleteAllVotesResponse = $q.defer();
                deleteAllVotesResponse.resolve([]);

                VotesService.deleteAllVotes.andReturn(deleteAllVotesResponse.promise);

                var getVotesResponse = $q.defer();
                getVotesResponse.resolve([]);

                VotesService.getVotes.andReturn(getVotesResponse.promise);
                initializeController();

                $scope.clearVotes();
                $scope.$digest();

                expect($scope.votes.length).toBe(0);
                expect(growl.addInfoMessage).toHaveBeenCalledWith('All Votes have been cleared');
            });

            it("that displays an error if something catastrophic happens", function() {
                var deleteAllVotesResponse = $q.defer();
                deleteAllVotesResponse.reject('EpicFail');

                VotesService.deleteAllVotes.andReturn(deleteAllVotesResponse.promise); // Return an error

                $scope.clearVotes();
                $scope.$digest();

                expect(growl.addErrorMessage).toHaveBeenCalledWith("Something went wrong trying to clear all Votes");
            });
        });
    });
});