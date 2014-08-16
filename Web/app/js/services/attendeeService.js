'use strict';

/* Services */

angular.module('yieldtome.services')

.service('AttendeeService', ['$q', '$log', '$http', 'SessionService', 'ConfigService',
    function($q, $log, $http, SessionService, ConfigService) {

        this.attendEvent = function(event, name, profile)
        {
            $log.debug('Attempting to add Attendee to Event');
            var deferred = $q.defer();

            if (event == null || event.EventID == null) // Event is not provided
            {
                var error = 'An Event with an EventID is required';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            }
            if (profile != null && profile.ProfileID == null) // Profile is provided but a Profile ID is not provided
            {
                var error = 'A Profile with a ProfileID is required';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            }
            if (name == null || name == "") // Name is not provided
            {
                var error = 'An Attendee name required';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            }        

            // POST Attendees?eventID={eventID}&name={name}&profileID={profileID}
            var url = ConfigService.apiUrl + 'Attendees?eventID=' + event.EventID + '&name=' + name;
            if(profile) { url = url + '&profileID=' + profile.ProfileID; }
            
            $log.debug('Request Url: ' + url);

            $http.post(url).success(function(attendee) {
                $log.debug('Successfully attending Event as Attendee with AttendeeID: ' + attendee.AttendeeID);
                deferred.resolve(attendee);
            })
                .error(function(status) { // Otherwise, some unknown error occured
                    var error = 'Problem Attending Event. ' + status.Message;
                    $log.warn(error);
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        this.updateAttendee = function(attendee) {
            $log.debug('Attempting to update Attendee');
            var deferred = $q.defer();

            if (attendee == null) {
                var error = 'An Attendee object is needed';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            } else if (attendee.AttendeeID == null || attendee.Name == null) {
                var error = 'AttendeeID and Name are mandatory fields on an Attendee';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            }

            $log.debug('Attempting to edit the Attendee: ' + attendee.AttendeeID);
            
            var url = ConfigService.apiUrl + 'Attendees';
            $log.debug('Request Url: ' + url);

            $http.put(url, attendee).success(function(data) {
                $log.debug('Updated Attendee with AttendeeID: ' + data.AttendeeID);
                deferred.resolve(data);
            }).error(function(status) { // Otherwise, some unknown error occured
                var error = status.Message;
                $log.warn(error);
                deferred.reject(error);
            });

            return deferred.promise;
        };

        this.deleteAttendee = function(attendee)
        {
            $log.debug('Attempting to delete Attendee');
            var deferred = $q.defer();

            if (attendee == null) {
                var error = 'An Attendee object is needed';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            } else if (attendee.AttendeeID == null) {
                var error = 'An AttendeeID is required on the Attendee object';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            }

            $log.debug('Attempting to delete the Attendee: ' + attendee.AttendeeID);

            var url = ConfigService.apiUrl + 'Attendees/' + attendee.AttendeeID;
            $log.debug('Request Url: ' + url);

            $http.delete(url).success(function(data) {
                $log.debug('Successfully deleted Attendee with AttendeeID: ' + attendee.AttendeeID);
                deferred.resolve(data);
            }).error(function(status) { // Otherwise, some unknown error occured
                var error = status.Message;
                $log.warn(error);
                deferred.reject(error);
            });

            return deferred.promise;
        };

        this.getAttendees = function(event) {
            $log.debug('Attempting to get Attendees');
            var deferred = $q.defer();

            if (event == null) // Event is not provided
            {
                var error = 'An Event is required';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            }

            var url = ConfigService.apiUrl + 'Events/' + event.EventID + '/Attendees';
            $log.debug('Request Url: ' + url);

            $http.defaults.headers.common.Authorization = 'Bearer ' + SessionService.get('token'); // Add default http header

            $http.get(url).success(function(data) {
                $log.debug('Successfully retrieved ' + data.length + ' Attendees');
                deferred.resolve(data);
            })
                .error(function(status) { // Otherwise, some unknown error occured
                    var error = 'Problem getting Attendees. ' + status.Message;
                    $log.warn(error);
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        this.getAttendee = function(attendeeID) {

            $log.debug('Attempting to get Attendee associated with AttendeeID: ' + attendeeID);
            var deferred = $q.defer();

            if (attendeeID == null || attendeeID == 0) {
                var error = 'AttendeeID must be provided';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            }

            var url = ConfigService.apiUrl + 'Attendees/' + attendeeID;
            $log.debug('Request Url: ' + url);

            $http.get(url).success(function(data) {

                if (data == "null") // No List yet exists associated with this SpeakersListID
                {
                    var error = 'No Attendee associated with AttendeeID: ' + attendeeID;
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
    }
]);
