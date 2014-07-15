'use strict';

angular.module('yieldtome.services')

.service('PollService', ['$q', '$log', '$http', 'ConfigService',
    function($q, $log, $http, ConfigService) {

        this.deletePoll = function(poll) {
            $log.debug('Attempting to delete Poll');
            var deferred = $q.defer();

            if (poll == null) // Poll is not provided
            {
                var error = 'A Poll is required';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            }

            // DELETE Polls/{pollID}
            var url = ConfigService.apiUrl + 'Polls/' + poll.PollID;
            $log.debug('Request Url: ' + url);

            $http.delete(url).success(function(data) {
                $log.debug('Poll deleted successfully.');
                deferred.resolve(data);
            })
            .error(function(status) { // Otherwise, some unknown error occured
                var error = status.Message;
                $log.warn(error);
                deferred.reject(error);
            });

            return deferred.promise;
        };

        this.updatePoll = function(poll) {
            $log.debug('Attempting to update Poll');
            var deferred = $q.defer();

            if (poll == null) {
                var error = 'A Poll object is needed';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            } else if (poll.Name == null || poll.CreatorID == null) {
                var error = 'Both Name and CreatorID are mandatory fields on a Speakers List';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            }

            $log.debug('Attempting to update the Poll: ' + poll.Name);

            var url = ConfigService.apiUrl + 'Polls/';

            $log.debug('Request Url: ' + url);

            $http.put(url, poll).success(function(data) {
                $log.debug('Updated Poll with PollID: ' + data.pollID);
                deferred.resolve(data);
            }).error(function(status) { // Otherwise, some unknown error occured
                var error = status.Message;
                $log.warn(error);
                deferred.reject(error);
            });

            return deferred.promise;
        };

        this.getPoll = function(pollID) {

            $log.debug('Attempting to get Poll associated with PollID: ' + pollID);
            var deferred = $q.defer();

            if (pollID == null || pollID == 0) {
                var error = 'PollID must be provided';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            }

            var url = ConfigService.apiUrl + 'Polls/' + pollID;
            $log.debug('Request Url: ' + url);

            $http.get(url).success(function(data) {

                if (data == "null") // No List yet exists associated with this SpeakersListID
                {
                    var error = 'No Poll associated with PollID: ' + pollID;
                    $log.debug(error);
                    deferred.resolve(null);
                } else // Otherwise, there is a SpeakersList associated with this SpeakersListID
                {
                    deferred.resolve(data);
                }

            }).error(function(status) { // Otherwise, some unknown error occured
                var error = status.Message;
                $log.warn(error);
                deferred.reject(error);
            });

            return deferred.promise;
        };

        this.createPoll = function(event, poll, doAbstainsCount) {
            $log.debug('Attempting to create a new Speakers List');
            var deferred = $q.defer();

            if (event == null || event.EventID == null) {
                var error = 'An Event object with an EventID is needed';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            } else if (poll == null) {
                var error = 'A Poll object is needed';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            } else if (poll.Name == null || poll.CreatorID == null) {
                var error = 'Both Name and CreatorID are mandatory fields on a Poll';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            }

            $log.debug('Attempting to create the Poll: ' + poll.Name);

            // POST Polls?eventID={eventID}&name={name}&creatorID={creatorID}&majorityRequired={majorityRequired}&doAbstainsCount={doAbstainsCount}
            var url = ConfigService.apiUrl + 'Polls?eventID=' + event.EventID +
                                            '&name=' + poll.Name +
                                            '&creatorID=' + poll.CreatorID;

            if(poll.MajorityRequired != null) { url = url + '&majorityRequired=' + poll.MajorityRequired; }
            if(doAbstainsCount) { url = url + '&doAbstainsCount=' + doAbstainsCount; }

            $log.debug('Request Url: ' + url);

            $http.post(url).success(function(data) {
                $log.debug('New Poll created with PollID: ' + data.PollID);
                deferred.resolve(data);
            }).error(function(status) { // Otherwise, some unknown error occured
                var error = status.Message;
                $log.warn(error);
                deferred.reject(error);
            });

            return deferred.promise;
        };

        this.getPolls = function(event) {
            $log.debug('Attempting to get Polls');
            var deferred = $q.defer();

            if (event == null) // Event is not provided
            {
                var error = 'An Event is required';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            }

            var url = ConfigService.apiUrl + 'Events/' + event.EventID + '/Polls';
            $log.debug('Request Url: ' + url);

            $http.get(url).success(function(data) {
                $log.debug('Successfully retrieved ' + data.length + ' Polls');
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
