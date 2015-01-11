'use strict';

angular.module('yieldtome.controllers')

.controller('DirectMessage', ['$scope', '$location', '$log', '$routeParams', '$modal', '$interval', 'growl', 'SessionService', 'ChatService', 'AttendeeService',
    function($scope, $location, $log, $routeParams, $modal, $interval, growl, SessionService, ChatService, AttendeeService) {

        $log.debug("DirectMessage controller executing");

        $scope.event;
        $scope.profile; // The authenticated Profile, if it exists
        $scope.sender; // This user's Attendee context
        $scope.attendee; // The Attendee to receive DirectMessages 
        $scope.messages; 

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
            if (e.keyCode == 13){ 
                var message = e.target.value;

                if(message.length != 0) {
                    $scope.sendMessage(message);
                    $scope.sendConfirm.close();   
                };       
            }; 
        };

        // Opens the send message modal
        $scope.showSend = function() {
            $scope.sendConfirm = $modal.open({ 
                templateUrl: 'partials/chat/sendMessage.html',
                scope: $scope
            }); 
        };

        // Is called when the cancel or 'x' buttons are clicked on the modal 
        $scope.cancelSend = function() {
            $scope.sendConfirm.dismiss();
        };

        $scope.sendMessage = function(messageToSend) {
            $log.debug('DirectMessage.sendMessage() starting');

            if(messageToSend == null || messageToSend.length == 0) { return; }

            ChatService.sendMessage($scope.sender.AttendeeID, $scope.attendee.AttendeeID, messageToSend)
            .then(function(message) { // It all went well 
                $scope.updateMessages($scope.sender.AttendeeID, $scope.attendee.AttendeeID);
            })
            .catch (function(error) { // The service crapped out
                $log.warn(error);
                var message = "Something went wrong trying to send your message to " + $scope.attendee.Name;
                growl.addErrorMessage(message);
            });
        };

        $scope.updateMessages = function(){
            $log.debug('DirectMessage.updateMessages() starting');

            ChatService.getMessages($scope.sender.AttendeeID, $scope.attendee.AttendeeID)
            .then(function(messages) {
                $scope.messages = messages.reverse();
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
                $scope.updateMessages();
                $scope.intervalPromise = $interval($scope.updateMessages, 15000);
            })
            .catch (function(error) {
                $log.warn(error);
                growl.addErrorMessage("Something went wrong trying to get this Attendee");
            });

            // Destroy the interval promise when this controller is destroyed
            $scope.$on('$destroy', function() {
                $log.debug("Destroying updateMessages interval timer");
                if (angular.isDefined($scope.intervalPromise)) {
                    $interval.cancel($scope.intervalPromise);
                    $scope.intervalPromise = undefined;
                }
            });
        })();
    }
]);
