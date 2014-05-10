'use strict';

/* Services */

angular.module('yieldtome.services')

.service('AttendeeService', ['$q', '$log', '$http', '$window', 'ConfigService',
    function($q, $log, $http, $window, ConfigService) {

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

            $http.defaults.headers.common.Authorization = 'Bearer ' + $window.sessionStorage.token; // Add default http header

            $http.get(url).success(function(data) {
                $log.debug('Successfully retrieved ' + data.length + ' Attendees');
                deferred.resolve(data);
            })
                .error(function(status) { // Otherwise, some unknown error occured
                    var error = 'Problem getting Attendees. ' + status;
                    $log.warn(error);
                    deferred.reject(error);
                });

            return deferred.promise;
        };

    }
]);
