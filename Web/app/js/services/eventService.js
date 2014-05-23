'use strict';

/* Services */

angular.module('yieldtome.services')

.service('EventService', ['$q', '$log', '$http', '$window', 'ConfigService',
    function($q, $log, $http, $window, ConfigService) {

        this.getEvents = function() {
            $log.debug('Attempting to get Events');
            var deferred = $q.defer();

            var url = ConfigService.apiUrl + 'Events';
            $log.debug('Request Url: ' + url);

            $http.get(url).success(function(data) {
                $log.debug('Successfully retrieved ' + data.length + ' Events');
                deferred.resolve(data);
            })
                .error(function(status) { // Otherwise, some unknown error occured
                    var error = 'Problem getting Events. ' + status;
                    $log.warn(error);
                    deferred.reject(error);
                });

            return deferred.promise;
        };

    }
]);
