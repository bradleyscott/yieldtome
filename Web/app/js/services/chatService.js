'use strict';

angular.module('yieldtome.services')

.service('ChatService', ['$q', '$http', '$log', 'ConfigService', 'SessionService',
    function($q, $http, $log, ConfigService, SessionService) {

        this.subscribeToMessages = function(attendeeID, callback) {

            $log.debug('Trying to create subscription for DirectMessages for AttendeeID: ' + attendeeID);

            if(!io.socket.alreadyListeningToDirectMessages) {
	            io.socket.on("directmessage", function(message) {

	                if (message.data.recipientID == SessionService.get('attendee').AttendeeID && message.verb == 'created') {
	                    $log.debug('Received new message for me. Invoking callback function');
	                    callback(message.data); // Invoke callback
	                } else {
	                    $log.debug('Received message is not for me or not a new message. Discarding it');
	                }
	            });

	            $log.debug('Querying existing DirectMessages to complete subscription loop');

	            io.socket.get("/DirectMessages", function(data, res) {
	                $log.debug("Whoa. There has been " + data.length + " yieldto.me DirectMessages sent");
	            });

	            io.socket.alreadyListeningToDirectMessages = true;
            }
            else 
            {
                $log.debug('Already subscribed to DirectMessages');
            }
        };

        this.getMessages = function(senderID, recipientID) {

            var deferred = $q.defer();

            if (senderID == null || senderID == 0 || recipientID == null || recipientID == 0) {
                var error = 'senderID and recipientID must be provided';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            }

            $log.debug('Attempting to get DirectMessages exchanged between AttendeeIDs: ' + senderID + ' and ' + recipientID);

            var url = ConfigService.chatApiUrl + '/messagesBetween/' + senderID + '/and/' + recipientID;
            $log.debug('Request Url: ' + url);

            $http.get(url).success(function(data) {
                $log.debug('Successfully retrieved ' + data.length + ' messages');
                deferred.resolve(data);
            }).error(function(status) { // Otherwise, some unknown error occured
                var error = status.Message;
                $log.warn(error);
                deferred.reject(error);
            });

            return deferred.promise;
        };

        this.sendMessage = function(senderID, recipientID, message) {

            var deferred = $q.defer();

            if (message == null || message.length == 0) {
                var error = 'A message is needed';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            } else if (senderID == null || senderID == 0 || recipientID == null || recipientID == 0) {
                var error = 'senderID and recipientID must be provided';
                $log.warn(error);
                deferred.reject(error);
                return deferred.promise;
            }

            $log.debug('Attempting to send message from AttendeeID ' + senderID + ' to AttendeeID ' + recipientID);

            var url = ConfigService.chatApiUrl + '/DirectMessages';
            $log.debug('Request Url: ' + url);

            var body = {
                senderID: senderID,
                recipientID: recipientID,
                message: message
            };

            $http.post(url, body).success(function(data) {
                $log.debug('New DirectMessage created with id: ' + data.id);
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
