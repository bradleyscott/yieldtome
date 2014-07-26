'use strict';

/* Controllers */

angular.module('yieldtome.controllers')

.controller('Votes', ['$scope', '$location', '$log', '$window', '$routeParams', 'SessionService', 'PollService', 'VotesService',
    function($scope, $location, $log, $window, $routeParams, SessionService, PollService, VotesService) {

        $log.debug("Polls controller executing");

        $scope.error; // An error message that will be displayed to screen
        $scope.info; // An info message that will be displayed to screen
        $scope.profile; // The authenticated Profile, if it exists
        $scope.event; // Selected Event
        $scope.attendee; // Attendee record for this Profile
        $scope.poll; // The Poll being displayed
        $scope.votes; // The list of Votes 
        $scope.myVote; // The Vote this Attendee has cast
        $scope.voteFilter = { text:'', for:true, against:true, abstain:false }; // An object containg variables to filter against 

        $scope.$back = function() {
            window.history.back();
        };

        // Casts a Vote
        $scope.castVote = function(attendee, result) {
            $log.debug('VotesController.vote() executing');
            var promise = VotesService.createVote($scope.poll, attendee, result);

            promise.then(function(response) {
                $scope.getUpdatedPoll($scope.poll.PollID);
                $log.debug('$scope.votes updated after vote()');

                var message;
                if(result == 'Abstain') { message = attendee.Name + " has Abstained"; }
                else { message = attendee.Name + " has voted " + result; }
                $scope.info = message;
            })            
            .catch (function(error) {
                $log.warn(error);
                $scope.error = "Something went wrong trying to cast a Vote";
            });                
        };

        // Filters out non-matching Votes from the vote list
        $scope.filteredVotes = function(vote){

            if($scope.voteFilter.text.length > 0 && // There is a text filter
                vote.Attendee.Name.indexOf($scope.voteFilter.text) == -1 && // Attendee name doesn't match filter
                vote.Attendee.Profile.Name.indexOf($scope.voteFilter.text) == -1) { // Profile name doesn't match filter
                return false;
            }

            var match = false; // Match if any of the following is true
            if($scope.voteFilter.for && vote.VoteResult == 'For') { match = true; }
            if($scope.voteFilter.against && vote.VoteResult == 'Against') { match = true; }
            if($scope.voteFilter.abstain && vote.VoteResult == 'Abstain') { match = true; }
            return match;
        };

        // Retrieves the Votes
        $scope.getVotes = function() {
            $log.debug('VotesController.getVotes() executing');
            var promise = VotesService.getVotes($scope.poll);

            promise.then(function(votes) {
                $scope.votes = votes;

                // Retrieve the Vote this Attendee has cast
                for (var i = 0; i < votes.length; i++) {
                    if (votes[i].Attendee.AttendeeID == $scope.attendee.AttendeeID) {
                        $log.debug('AttendeeID ' + $scope.attendee.AttendeeID + ' has cast a Vote of ' + votes[i].VoteResult);
                        $scope.myVote = votes[i];
                    }
                }

                var myVoteIndex = votes.indexOf($scope.myVote);
                $scope.otherVotes = votes.slice(0);
                $scope.otherVotes.splice(myVoteIndex, 1); 
            })            
            .catch (function(error) {
                $log.warn(error);
                $scope.error = "Something went wrong trying to get the Votes on this Poll";
            });                
        };

        // Get the Poll record
        $scope.getUpdatedPoll = function(pollID)
        {
            var promise = PollService.getPoll(pollID);

            promise.then(function(poll) {
                $scope.poll = poll;
                $scope.getVotes();
            })
            .catch (function(error) {
                $log.warn(error);
                $scope.error = "Something went wrong trying to get this Poll";
            });                
        };

        // Controller initialize
        (function() {
            $log.debug('Retrieving Polls to create model');

            // Allocate the saved Profile to the controller
            $scope.profile = SessionService.get('profile');
            $scope.event = SessionService.get('event');
            $scope.attendee = SessionService.get('attendee');

            var pollID = $routeParams.pollID;
            $scope.getUpdatedPoll(pollID);
        })();
    }
]);
