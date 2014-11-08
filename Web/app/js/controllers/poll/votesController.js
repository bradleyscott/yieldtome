'use strict';

/* Controllers */

angular.module('yieldtome.controllers')

.controller('Votes', ['$scope', '$location', '$log', '$window', '$routeParams', '$interval', '$q', '$modal', 'growl', 'SessionService', 'PollService', 'VotesService',
    function($scope, $location, $log, $window, $routeParams, $interval, $q, $modal, growl, SessionService, PollService, VotesService) {

        $log.debug("Polls controller executing");

        $scope.error; // An error message that will be displayed to screen
        $scope.info; // An info message that will be displayed to screen
        $scope.profile; // The authenticated Profile, if it exists
        $scope.event; // Selected Event
        $scope.attendee; // Attendee record for this Profile
        $scope.poll; // The Poll being displayed
        $scope.votes; // The list of Votes 
        $scope.myVote; // The Vote this Attendee has cast
        $scope.voteFilter = { text:'', for:true, against:true, abstain:true }; // An object containg variables to filter against 
        $scope.intervalPromise; // The promise returned by the interval timer
        $scope.isCreator = false; // Indicates whether or not the user has edit right to this Poll

        $scope.$back = function() {
            window.history.back();
        };

        // Redirects to the View Profile page
        $scope.showProfile = function(profileID) {
            if(profileID != null && profileID != 0) {
                $log.debug('Redirecting to View profile ' + profileID);
                $location.path("/viewProfile/" + profileID);
            }
        };

        // Opens the settings modal
        $scope.showSettings = function() {
            $scope.settingsAction = $modal.open({ 
                templateUrl: 'partials/poll/settings.html',
                scope: $scope
            }); 

            $scope.settingsAction.result.then(function(action) { // Respond if user clicks an action button
                switch (action) {
                    case 'open':
                        $scope.openPoll();
                        break;
                    case 'close':
                        $scope.closePoll();
                        break;
                    case 'clear':
                        $scope.clearVotes();
                        break;
                    case 'edit':
                        $location.path("/editPoll/" + $scope.poll.PollID);
                        break;
                }
            });
        };

        // Is called when one of the action buttons is clicked on the modal
        $scope.doAction = function(action) {
            $scope.settingsAction.close(action);
        };

        // Is called when the cancel or 'x' buttons are clicked on the modal 
        $scope.cancelSettings = function() {
            $scope.settingsAction.dismiss();
        };

        // Opens the Poll to votes
        $scope.openPoll = function() {
            $log.debug('VotesController.openPoll() executing');

            $scope.poll.Status = 'Open';
            var promise = PollService.updatePoll($scope.poll);

            promise.then(function(poll) {
                $scope.poll = poll;
                growl.addInfoMessage(poll.Name + " opened for voting");
                $log.debug('$scope.poll updated after openPoll()');
            })            
            .catch (function(error) {
                $log.warn(error);
                growl.addErrorMessage("Something went wrong trying to open " + $scope.poll.Name + " for voting");
            });                
        };

        // Closes the Poll to votes
        $scope.closePoll = function() {
            $log.debug('VotesController.closePoll() executing');

            $scope.poll.Status = 'Closed';
            var promise = PollService.updatePoll($scope.poll);

            promise.then(function(poll) {
                $scope.poll = poll;
                growl.addInfoMessage(poll.Name + " closed to voting");
                $log.debug('$scope.poll updated after closePoll()');
            })            
            .catch (function(error) {
                $log.warn(error);
                growl.addErrorMessage("Something went wrong trying to close " + $scope.poll.Name + " to voting");
            });                
        };

        // Clears all Votes on the Poll
        $scope.clearVotes = function() {
            $log.debug('VotesController.clearVotes() executing');
            var promise = VotesService.deleteAllVotes($scope.poll);

            promise.then(function(votes) {
                $scope.votes = votes;
                $scope.getUpdatedPoll($scope.poll.PollID);
                growl.addInfoMessage("All Votes have been cleared");
                $log.debug('$scope.votes updated after clearVotes()');
            })            
            .catch (function(error) {
                $log.warn(error);
                growl.addErrorMessage("Something went wrong trying to clear all Votes");
            });                
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
                growl.addInfoMessage(message);
            })            
            .catch (function(error) {
                $log.warn(error);
                growl.addErrorMessage("Something went wrong trying to cast a Vote");
            });                
        };

        // Filters out non-matching Votes from the vote list
        $scope.filteredVotes = function(vote){

            if($scope.voteFilter.text.length > 0 && // There is a text filter
                vote.Attendee.Name.indexOf($scope.voteFilter.text) == -1 && // Attendee name doesn't match filter
                (vote.Attendee.Profile == null || // There is no Profile or
                vote.Attendee.Profile.Name.indexOf($scope.voteFilter.text) == -1)) { // Profile name doesn't match filter
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
                growl.addErrorMessage("Something went wrong trying to get the Votes on this Poll");
            });                
        };

        // Update this Poll
        $scope.getThisPollUpdate = function() {
            $scope.getUpdatedPoll($scope.poll.PollID);
        };

        // Get the Poll record
        $scope.getUpdatedPoll = function(pollID)
        {
            var deferred = $q.defer();
            var promise = PollService.getPoll(pollID);

            promise.then(function(poll) {
                $scope.poll = poll;
                $scope.getVotes();
                deferred.resolve();
            })
            .catch (function(error) {
                $log.warn(error);
                growl.addErrorMessage("Something went wrong trying to get this Poll");
                deferred.reject();
            });     

            return deferred.promise;
        };

        // Controller initialize
        (function() {
            $log.debug('Retrieving Polls to create model');

            // Allocate the saved Profile to the controller
            $scope.profile = SessionService.get('profile');
            $scope.event = SessionService.get('event');
            $scope.attendee = SessionService.get('attendee');

            // Get Poll and Votes
            var pollID = $routeParams.pollID;
            var promise = $scope.getUpdatedPoll(pollID);

            promise.then(function() {
                if($scope.poll.CreatorID != $scope.profile.ProfileID && $scope.event.CreatorID != $scope.profile.ProfileID) {
                    $log.debug("User is not the Poll or Event creator. Starting refresh timer");
                    $scope.intervalPromise = $interval($scope.getThisPollUpdate, 15000);
                    $scope.isCreator = false; // This user does not have edit rights
                }
                else { 
                    $log.debug("User is Event or Poll creator. Will not refresh Votes"); 
                    $scope.isCreator = true; // This user has edit rights
                }                
            });

            // Destroy the interval promise when this controller is destroyed
            $scope.$on('$destroy', function() {
                $log.debug("Destroying getThisPollUpdate interval timer");
                if (angular.isDefined($scope.intervalPromise)) {
                    $interval.cancel($scope.intervalPromise);
                    $scope.intervalPromise = undefined;
                }
            });
        })();
    }
]);
