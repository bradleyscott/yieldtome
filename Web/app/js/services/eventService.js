'use strict';

/* Services */

angular.module('yieldtome.services')

.service('EventService', ['$q', '$log', '$http', 'ConfigService',
    function($q, $log, $http, ConfigService) {

        this.getEvent = function(eventID) {

            $log.debug('Attempting to get the Event associated with EventID: ' + eventID);
            var deferred = $q.defer();

            if (eventID == null || eventID == 0) {
                var error = 'eventID must be provided';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            }

            var url = ConfigService.apiUrl + 'Events/' + eventID;
            $log.debug('Request Url: ' + url);

            $http.get(url).success(function(data) {

                if (data == "null") // No event yet exists associated with this Event ID
                {
                    var error = 'No Event associated with EventID: ' + eventID;
                    $log.debug(error);
                    deferred.resolve(null);
                } else // Otherwise, there is a Event associated with this Event ID
                {
                    $log.debug('Successfully retrieved Event with EventID: ' + data.EventID);
                    deferred.resolve(data);
                }

            }).error(function(status) { // Otherwise, some unknown error occured
                var error = status.Message;
                $log.warn(error);
                deferred.reject(error);
            });

            return deferred.promise;
        };

        this.editEvent = function(event)
        {
            $log.debug('Attempting to edit Event');
            var deferred = $q.defer();

            if (event == null) {
                var error = 'An Event object is needed';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            } else if (event.EventID == null || event.Name == null || event.StartDate == null || event.EndDate == null || event.CreatorID == null) {
                var error = 'EventID, Name, CreatorID, StartDate and EndDate are mandatory fields on an Event';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            }

            $log.debug('Attempting to edit the Event: ' + event.Name);
            
            var url = ConfigService.apiUrl + 'Events';
            $log.debug('Request Url: ' + url);

            $http.put(url, event).success(function(data) {
                $log.debug('Edited Event with EventID: ' + data.EventID);
                deferred.resolve(data);
            }).error(function(status) { // Otherwise, some unknown error occured
                var error = status.Message;
                $log.warn(error);
                deferred.reject(error);
            });

            return deferred.promise;
        };

        this.deleteEvent = function(event)
        {
            $log.debug('Attempting to delete Event');
            var deferred = $q.defer();

            if (event == null) {
                var error = 'An Event object is needed';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            } else if (event.EventID == null) {
                var error = 'An EventID is required on the Event object';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            }

            $log.debug('Attempting to delete the Event: ' + event.EventID);

            var url = ConfigService.apiUrl + 'Events/' + event.EventID;
            $log.debug('Request Url: ' + url);

            $http.delete(url).success(function(data) {
                $log.debug('Successfully deleted Event with EventID: ' + event.EventID);
                deferred.resolve(data);
            }).error(function(status) { // Otherwise, some unknown error occured
                var error = status.Message;
                $log.warn(error);
                deferred.reject(error);
            });

            return deferred.promise;
        };

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
            var url = ConfigService.apiUrl + 'Events?name=' + event.Name +
                                            '&startDate=' + event.StartDate.toJSON() +
                                            '&endDate=' + event.EndDate.toJSON() +
                                            '&creatorID=' + event.CreatorID;

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
