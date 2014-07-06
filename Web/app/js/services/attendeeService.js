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
            if (profile == null || profile.ProfileID == null) // Profile is not provided
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
            var url = ConfigService.apiUrl + 'Attendees?eventID=' + event.EventID + '&name=' + name + '&profileID=' + profile.ProfileID;
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

    }
]);
