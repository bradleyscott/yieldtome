'use strict';

/* Services */

angular.module('yieldtome.services')

.service('SpeakersService', ['$q', '$log', '$http', 'ConfigService',
    function($q, $log, $http, ConfigService) {

        this.createSpeaker = function(list, attendee, position) {
            $log.debug('Attempting to create a new Speaker');
            var deferred = $q.defer();

            if (attendee == null || attendee.AttendeeID == null) {
                var error = 'An Attendee object with an AttendeeID is needed';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            } else if (list == null || list.SpeakersListID == null) {
                var error = 'A SpeakersList object with a SpeakersLIstID is needed';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            }

            $log.debug('Attempting to create the SpeakersList: ' + list.Name);

            // POST Speakers?speakersListID={speakersListID}&attendeeID={attendeeID}&position={position}
            var url = ConfigService.apiUrl + 'Speakers?speakersListID=' + list.SpeakersListID +
                                            '&attendeeID=' + attendee.AttendeeID +
                                            '&position=' + position;

            $log.debug('Request Url: ' + url);

            $http.post(url).success(function(data) {
                $log.debug('New Speaker created with SpeakerID: ' + data.SpeakerID);
                deferred.resolve(data);
            }).error(function(status) { // Otherwise, some unknown error occured
                var error = status.Message;
                $log.warn(error);
                deferred.reject(error);
            });

            return deferred.promise;
        };

        this.deleteAllSpeakers = function(list) {
            $log.debug('Attempting to clear all the Speakers in the SpeakersList');
            var deferred = $q.defer();

            if (list == null) // SpeakersList is not provided
            {
                var error = 'A SpeakersList is required';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            }

            var url = ConfigService.apiUrl + 'SpeakersLists/' + list.SpeakersListID + '/Speakers';
            $log.debug('Request Url: ' + url);

            $http.delete(url).success(function(data) {
                $log.debug('Successfully deleted Speakers. There are now ' + data.length + ' Speakers');
                deferred.resolve(data);
            })
                .error(function(status) { // Otherwise, some unknown error occured
                    var error = status.Message;
                    $log.warn(error);
                    deferred.reject(error);
                });

            return deferred.promise;
        };

    	this.deleteSpeaker = function(speaker) {
            $log.debug('Attempting to delete Speaker');
            var deferred = $q.defer();

            if (speaker == null) // Speakers is not provided
            {
                var error = 'A Speaker is required';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            }

            var url = ConfigService.apiUrl + 'Speakers/' + speaker.SpeakerID;
            $log.debug('Request Url: ' + url);

            $http.delete(url).success(function(data) {
                $log.debug('Speaker deleted successfully. New list has ' + data.length + ' Speakers');
                deferred.resolve(data);
            })
                .error(function(status) { // Otherwise, some unknown error occured
                    var error = status.Message;
                    $log.warn(error);
                    deferred.reject(error);
                });

            return deferred.promise;
    	};

    	this.reorderSpeakers = function(list, speakers) {
            $log.debug('Attempting to reorder the SpeakersList speakers');
            var deferred = $q.defer();

            if (speakers == null || list == null || list.SpeakersListID == null)
            {
                var error = 'A SpeakersList with SpeakersListID and Speakers is required';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            }

            var url = ConfigService.apiUrl + 'Speakers?speakersListID=' + list.SpeakersListID;
            $log.debug('Request Url: ' + url);

            $http.put(url, speakers).success(function(data) {
                $log.debug('Speakers have been updated. New list has ' + data.length + ' Speakers');
                deferred.resolve(data);
            })
                .error(function(status) { // Otherwise, some unknown error occured
                    var error = status.Message;
                    $log.warn(error);
                    deferred.reject(error);
                });

            return deferred.promise;
    	};

        this.speakerHasSpoken = function(speaker) {
            $log.debug('Attempting to mark Speaker as spoken');
            var deferred = $q.defer();

            if (speaker == null) // Speakers is not provided
            {
                var error = 'A Speaker is required';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            }

            var url = ConfigService.apiUrl + 'Speakers/' + speaker.SpeakerID;
            $log.debug('Request Url: ' + url);

            $http.put(url).success(function(data) {
                $log.debug('Speaker has spoken successfully. New list has ' + data.length + ' Speakers');
                deferred.resolve(data);
            })
                .error(function(status) { // Otherwise, some unknown error occured
                    var error = status.Message;
                    $log.warn(error);
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        this.getSpeakers = function(list) {
            $log.debug('Attempting to get Speakers');
            var deferred = $q.defer();

            if (list == null) // SpeakersList is not provided
            {
                var error = 'A SpeakersList is required';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            }

            var url = ConfigService.apiUrl + 'SpeakersLists/' + list.SpeakersListID + '/Speakers';
            $log.debug('Request Url: ' + url);

            $http.get(url).success(function(data) {
                $log.debug('Successfully retrieved ' + data.length + ' Speakers');
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
