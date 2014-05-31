'use strict';

/* Services */

angular.module('yieldtome.services')

.service('EventService', ['$q', '$log', '$http', '$window', 'ConfigService',
    function($q, $log, $http, $window, ConfigService) {

        this.createEvent = function(event)
        {
            $log.debug('Attempting to create a new Event');
            var deferred = $q.defer();

            if (event == null) {
                var error = 'An Event object is needed';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            } else if (event.Name == null || event.StartDate == null || event.EndDate == null || event.CreatorID == null) {
                var error = 'Both Name, CreatorID, StartDate and EndDate are mandatory fields on an Event';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            }

            $log.debug('Attempting to create the Event: ' + event.Name);

            // POST Events?name={name}&startDate={startDate}&endDate={endDate}&creatorID={creatorID}&description={description}
            var url = ConfigService.apiUrl + 'Events?name='
                                            + event.Name
                                            + '&startDate='
                                            + event.StartDate.toJSON()
                                            + '&endDate='
                                            + event.EndDate.toJSON()
                                            + '&creatorID='
                                            + event.CreatorID;

            if(event.Description != null)
                { url = url + '&description=' + event.Description; }

            $log.debug('Request Url: ' + url);

            $http.post(url).success(function(data) {
                $log.debug('New Event created with EventID: ' + data.EventID);
                deferred.resolve(data);
            }).error(function(status) { // Otherwise, some unknown error occured
                var error = status.Message;
                $log.warn(error);
                deferred.reject(error);
            });

            return deferred.promise;
        };
        
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
                    var error = status.Message;
                    $log.warn(error);
                    deferred.reject(error);
                });

            return deferred.promise;
        };

    }
]);
