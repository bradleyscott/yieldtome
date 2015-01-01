'use strict';

angular.module('yieldtome.controllers')

.controller('DirectMessage', ['$scope', '$location', '$log', '$routeParams', 'growl', 'SessionService', 'ChatService', 'AttendeeService',
    function($scope, $location, $log, $routeParams, growl, SessionService, ChatService, AttendeeService) {

        $log.debug("DirectMessage controller executing");

        $scope.event;
        $scope.profile; // The authenticated Profile, if it exists
        $scope.sender; // This user's Attendee context
        $scope.attendee; // The Attendee to receive DirectMessages 
        $scope.messages; 
        $scope.messageToSend = "";

        $scope.$back = function() {
            $window.history.back();
        };

        // Redirects to the View Profile page
        $scope.showProfile = function(profileID) {
            if(profileID != null && profileID != 0) {
                $log.debug('Redirecting to View profile ' + profileID);
                $location.path("/viewProfile/" + profileID);
            }
        };

        $scope.checkForEnter = function(e) {
            if (e.keyCode == 13){ $scope.sendMessage(); }
        };

        $scope.sendMessage = function() {
            $log.debug('DirectMessage.sendMessage() starting');

            if($scope.messageToSend.length == 0) {
                $log.debug('No message to send');
                return;
            };

            ChatService.sendMessage($scope.sender.AttendeeID, $scope.attendee.AttendeeID, $scope.messageToSend)
            .then(function(message) { // It all went well 
                $scope.updateMessages($scope.sender.AttendeeID, $scope.attendee.AttendeeID);
                $scope.messageToSend = "";
            })
            .catch (function(error) { // The service crapped out
                $log.warn(error);
                var message = "Something went wrong trying to send your message to " + $scope.attendee.Name;
                growl.addErrorMessage(message);
            });
        };

        $scope.updateMessages = function(senderID, recipientID){
            $log.debug('DirectMessage.updateMessages() starting');

            ChatService.getMessages(senderID, recipientID)
            .then(function(messages) {
             $scope.messages = messages;
            })
            .catch (function(error) {
                $log.warn(error);
                growl.addErrorMessage("Something went wrong trying to get Messages");
            });
        };

        // Controller initialization
        (function() {
            $scope.profile = SessionService.get('profile');
            $scope.event = SessionService.get('event');
            $scope.sender = SessionService.get('attendee');

            // Ugly hack to hide footer
            angular.element("#footer").remove();

            // Get recipient Attendee
            $log.debug('Retrieving Recipient Attendee record');
            var recipientID = $routeParams.attendeeID;

            AttendeeService.getAttendee(recipientID)
            .then(function(recipient) {
                $scope.attendee = recipient;
                $scope.updateMessages($scope.sender.AttendeeID, $scope.attendee.AttendeeID);
            })
            .catch (function(error) {
                $log.warn(error);
                growl.addErrorMessage("Something went wrong trying to get this Attendee");
            });
        })();
    }
]);
