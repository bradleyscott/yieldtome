'use strict';

/* Services */

angular.module('yieldtome.services')

.service('VotesService', ['$q', '$log', '$http', 'ConfigService',
    function($q, $log, $http, ConfigService) {

        this.createVote = function(poll, attendee, result) {
            $log.debug('Attempting to create a new Vote');
            var deferred = $q.defer();

            if (attendee == null || attendee.AttendeeID == null) {
                var error = 'An Attendee object with an AttendeeID is needed';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            } else if (poll == null || poll.PollID == null) {
                var error = 'A Poll object with a PollID is needed';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            }

            // POST Votes?attendeeID={attendeeID}&pollID={pollID}&result={result}
            var url = ConfigService.apiUrl + 'Votes?pollID=' + poll.PollID +
                                            '&attendeeID=' + attendee.AttendeeID +
                                            '&result=' + result;

            $log.debug('Request Url: ' + url);

            $http.post(url).success(function(data) {
                $log.debug('New Vote created with VoteID: ' + data.VoteID);
                deferred.resolve(data);
            }).error(function(status) { // Otherwise, some unknown error occured
                var error = status.Message;
                $log.warn(error);
                deferred.reject(error);
            });

            return deferred.promise;
        };

        this.clearAllVotes = function(poll) {
            $log.debug('Attempting to clear all the Votes cast on this Poll');
            var deferred = $q.defer();

            if (poll == null)
            {
                var error = 'A Poll is required';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            }

            var url = ConfigService.apiUrl + 'Polls/' + poll.PollID + '/Votes';
            $log.debug('Request Url: ' + url);

            $http.delete(url).success(function(data) {
                $log.debug('Successfully cleared Votes. There are now ' + data.length + ' Votes cast');
                deferred.resolve(data);
            })
                .error(function(status) { // Otherwise, some unknown error occured
                    var error = status.Message;
                    $log.warn(error);
                    deferred.reject(error);
                });

            return deferred.promise;
        };

    	this.clearVote = function(vote) {
            $log.debug('Attempting to clear Vote');
            var deferred = $q.defer();

            if (vote == null)
            {
                var error = 'A Vote is required';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            }
            if(vote.VoteID == 0) // The attendee hasn't actually cast a vote. Trying to clear a no-vote
            {
                $log.debug('No Vote has been cast by this Attendee');
                deferred.resolve();
                return deferred.promise;
            }

            var url = ConfigService.apiUrl + 'Votes/' + vote.VoteID;
            $log.debug('Request Url: ' + url);

            $http.delete(url).success(function(data) {
                $log.debug('Vote cleared successfully. Poll has ' + data.length + ' Votes');
                deferred.resolve(data);
            })
                .error(function(status) { // Otherwise, some unknown error occured
                    var error = status.Message;
                    $log.warn(error);
                    deferred.reject(error);
                });

            return deferred.promise;
    	};

        this.getVotes = function(poll) {
            $log.debug('Attempting to get Polls');
            var deferred = $q.defer();

            if (poll == null)
            {
                var error = 'A Poll is required';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            }

            var url = ConfigService.apiUrl + 'Polls/' + poll.PollID + '/Votes';
            $log.debug('Request Url: ' + url);

            $http.get(url).success(function(data) {
                $log.debug('Successfully retrieved ' + data.length + ' Votes');
                deferred.resolve(data);
            })
                .error(function(status) { // Otherwise, some unknown error occured
                    var error = status.Message;
                    $log.warn(error);
                    deferred.reject(error);
                });

            return deferred.promise;
        };
    }
]);
