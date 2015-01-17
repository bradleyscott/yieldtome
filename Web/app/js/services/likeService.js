'use strict';

angular.module('yieldtome.services')

.service('LikeService', ['$q', '$log', '$http', 'ConfigService',
    function($q, $log, $http, ConfigService) {

        this.isLikeRequited = function(liker, liked) {
            $log.debug('Attempting to determine if Like is requited');
            var deferred = $q.defer();

            if (liker == null || liker.AttendeeID == null) {
                var error = 'An Liker Attendee object with an AttendeeID is needed';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            } else if (liked == null || liked.AttendeeID == null) {
                var error = 'A Liked Attendee object with a AttendeeID is needed';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            }

            // PUT Likes?likerID=1&likedID=5
            var url = ConfigService.apiUrl + 'Likes?likerID=' + liker.AttendeeID + '&likedID=' + liked.AttendeeID;
            $log.debug('Request Url: ' + url);

            $http.put(url).success(function(data) {
                if(data == true) { $log.debug('Like is requited'); }
                else { $log.debug("Like isn't requited"); }
                deferred.resolve(data);
            }).error(function(status) { // Otherwise, some unknown error occured
                var error = status.Message;
                $log.warn(error);
                deferred.reject(error);
            });

            return deferred.promise;
        };

        this.doesLikeExist = function(liker, liked) {
            $log.debug('Attempting to retrieve a Like');
            var deferred = $q.defer();

            if (liker == null || liker.AttendeeID == null) {
                var error = 'An Liker Attendee object with an AttendeeID is needed';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            } else if (liked == null || liked.AttendeeID == null) {
                var error = 'A Liked Attendee object with a AttendeeID is needed';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            }

            // GET Likes?likerID=1&likedID=5
            var url = ConfigService.apiUrl + 'Likes?likerID=' + liker.AttendeeID + '&likedID=' + liked.AttendeeID;
            $log.debug('Request Url: ' + url);

            $http.get(url).success(function(data) {
                if(data == true) { $log.debug('Like does exist'); }
                else { $log.debug("Like doesn't exist"); }
                deferred.resolve(data);
            }).error(function(status) { // Otherwise, some unknown error occured
                var error = status.Message;
                $log.warn(error);
                deferred.reject(error);
            });

            return deferred.promise;
        };

        this.createLike = function(liker, liked) {
            $log.debug('Attempting to create a new Like');
            var deferred = $q.defer();

             if (liker == null || liker.AttendeeID == null) {
                var error = 'An Liker Attendee object with an AttendeeID is needed';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            } else if (liked == null || liked.AttendeeID == null) {
                var error = 'A Liked Attendee object with a AttendeeID is needed';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            }

            // POST Likes?likerID=1&likedID=5
            var url = ConfigService.apiUrl + 'Likes?likerID=' + liker.AttendeeID + '&likedID=' + liked.AttendeeID;
            $log.debug('Request Url: ' + url);

            $http.post(url).success(function(data) {
                $log.debug('New Liked created');
                if(data == true) { $log.debug('Like is requited'); }
                deferred.resolve(data);
            }).error(function(status) { // Otherwise, some unknown error occured
                var error = status.Message;
                $log.warn(error);
                deferred.reject(error);
            });

            return deferred.promise;
        };
    }
]);
