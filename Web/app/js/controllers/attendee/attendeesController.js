'use strict';

angular.module('yieldtome.controllers')

.controller('Attendees', ['$scope', '$log', '$location', 'growl', 'Notification', 'SessionService', 'AttendeeService', 'ChatService',
    function($scope, $log, $location, growl, Notification, SessionService, AttendeeService, ChatService) {

        $log.debug("Attendees controller executing");

        $scope.event;
        $scope.profile;
        $scope.attendee;
        $scope.attendees; // List of Attendees for this Event
        $scope.isCreator = false; // Indicates whether or not the user has edit right to this Event

        // Redirects to the View Profile page
        $scope.showProfile = function(profileID, $event) {
            // Prevent bubbling to showItem.
            // On recent browsers, only $event.stopPropagation() is needed
            if ($event.stopPropagation) $event.stopPropagation();
            if ($event.preventDefault) $event.preventDefault();
            $event.cancelBubble = true;
            $event.returnValue = false;

            if (profileID != null && profileID != 0) {
                $log.debug('Redirecting to View profile ' + profileID);
                $location.path("/viewProfile/" + profileID);
            }
        };

        // Redirects to the Chat page
        $scope.showChat = function(attendeeID) {
            if (attendeeID != null && attendeeID != 0) {
                $log.debug('Redirecting to Chat with AttendeeID ' + attendeeID);
                $location.path("/attendees/" + attendeeID + '/chat');
            }
        };

        $scope.newAttendee = function() {
            $log.debug('User clicked the New Attendee button');
            $location.path('/createAttendee');
        };

        $scope.editAttendee = function(attendeeID, $event) {
            // Prevent bubbling to showItem.
            // On recent browsers, only $event.stopPropagation() is needed
            if ($event.stopPropagation) $event.stopPropagation();
            if ($event.preventDefault) $event.preventDefault();
            $event.cancelBubble = true;
            $event.returnValue = false;

            if (attendeeID != null && attendeeID != 0) {
                $log.debug('Redirecting to Edit Attendee ' + attendeeID);
                $location.path("/editAttendee/" + attendeeID);
            }
        };

        // Controller initialization
        (function() {
            $scope.profile = SessionService.get('profile');
            $scope.event = SessionService.get('event');
            $scope.attendee = SessionService.get('attendee');

            // Display an error if you don't have the right event
            if ($scope.event == 'undefined' || $scope.event == undefined) {
                growl.addErrorMessage("We don't know what Event you're attending");
                return;
            }

            // Set the creator flag
            if ($scope.event.CreatorID == $scope.profile.ProfileID) {
                $scope.isCreator = true;
            }

            // Get Event Attendees
            var attendeesPromise = AttendeeService.getAttendees($scope.event);

            attendeesPromise.then(function(attendees) {
                    var myAttendee = _.findWhere(attendees, {
                        AttendeeID: $scope.attendee.AttendeeID
                    });
                    var attendeeIndex = attendees.indexOf(myAttendee);
                    attendees.splice(attendeeIndex, 1);

                    $scope.attendees = attendees;
                    $log.debug($scope.attendees.length + ' Attendees who are not this user');
                })
                .catch(function(error) {
                    $log.warn(error);
                    growl.addErrorMessage("Something went wrong trying to get the list of Attendees");
                });

            // Subscribe to incoming messages
            ChatService.subscribeToMessages($scope.attendee.AttendeeID, function(message) {
                AttendeeService.getAttendee(message.senderID).then(function(sender) {

                    var title = "Message from " + sender.Name;

                    if (!("Notification" in window)) { // Does browser support Notifications
                        // Popup Alert in-app
                        var htmlAlert = "<a href='#/attendees/" + sender.AttendeeID + "/chat?" + message.id + "'><strong>" + title + "</strong><br>" + message.message + "</a>";
                        growl.addInfoMessage(htmlAlert, {
                            ttl: -1
                        });
                    } else { // Popup native notification
                        new Notification(title, {
                            body: message.message,
                            icon: 'img/Attendees_Thumbnail.jpg',
                            delay: 10000, // in ms
                        });
                    }
                });
            });
        })();

    }
]);
