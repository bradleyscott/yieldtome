'use strict';

angular.module('yieldtome.controllers')

.controller('EditAttendee', ['$scope', '$location', '$log', '$window', '$modal', '$routeParams', 'growl', 'SessionService', 'AttendeeService',
    function($scope, $location, $log, $window, $modal, $routeParams, growl, SessionService, AttendeeService) {

        $log.debug("EditAttendee controller executing");

        $scope.title = 'Change attendance';
        $scope.alternatebutton = 'Back';
        $scope.event;
        $scope.attendees; // The Attendee list for this Event
        $scope.profile;
        $scope.attendee; // The user's Attendee context
        $scope.selectedAttendee; // The Attendee to edit 
        $scope.isEditingSelf; // Is the user editing their own Attendee context?
        $scope.isDeleteEnabled = true; // Enables the Delete button

        $scope.$back = function() {
            $window.history.back();
        };

        // Opens the delete list event modal
        $scope.showDelete = function() {
            $scope.deleteConfirm = $modal.open({ 
                templateUrl: 'partials/attendee/deleteAttendee.html',
                scope: $scope
            }); 

            $scope.deleteConfirm.result.then(function() { // Respond if user clicks delete
                $scope.deleteAttendee();
            },
            function(){ // Respond if user cancels the delete
                $log.debug('User cancelled Attendee delete');
            });
        };

        // Is called when the delete button is clicked on the modal
        $scope.confirmDelete = function() {
            $scope.deleteConfirm.close();
        };

        // Is called when the cancel or 'x' buttons are clicked on the modal 
        $scope.cancelDelete = function() {
            $scope.deleteConfirm.dismiss();
        };

        // Delete the Speakers list
        $scope.deleteAttendee = function()
        {
            $log.debug('EditAttendee.deleteAttendee() executing');
            var promise = AttendeeService.deleteAttendee($scope.selectedAttendee);

            promise.then(function(data) {
                $log.debug('Attendee deleted after deleteAttendee()');

                if($scope.isEditingSelf) { 
                    SessionService.set('attendee', null); 
                    growl.addInfoMessage("You are no longer representing " + $scope.selectedAttendee.Name);
                    $location.path('/events');
                }
                else if($scope.selectedAttendee.Profile) { 
                    growl.addInfoMessage($scope.selectedAttendee.Profile.Name + ' is no longer representing ' + $scope.selectedAttendee.Name); 
                    $location.path('/attendees');
                }
                else { // There is no profile record
                     growl.addInfoMessage($scope.selectedAttendee.Name + ' is no longer attending ' + $scope.event.Name); 
                    $location.path('/attendees');                   
                }
            })            
            .catch (function(error) {
                $log.warn(error);

                var message;  
                if($scope.isEditingSelf) { message = "Something went wrong trying to remove yourself from this delegation. " + error; }
                else { message = "Something went wrong trying to remove this Attendee from this delegation. " + error; }
                growl.addErrorMessage(message);
            });                
        };

        $scope.save = function() // Edit Poll
        {
            $log.debug('EditAttendee.save() starting');

            var promise = AttendeeService.updateAttendee($scope.selectedAttendee);

            promise.then(function(updatedAttendee) { // It all went well 
                $scope.selectedAttendee = updatedAttendee;

                var message;  
                if($scope.isEditingSelf) { 
                    SessionService.set('attendee', updatedAttendee);
                    message = 'You successfully renamed your delegation to ' + updatedAttendee.Name; 
                }
                else { message = 'You successfully renamed this delegation to ' + updatedAttendee.Name; }
                growl.addInfoMessage(message);

                $location.path('/attendees'); // Redirect
            })
            .catch (function(error) { // The service crapped out
                $log.warn(error);

                var message;  
                if($scope.isEditingSelf) { message = "Something went wrong trying to rename your delegation. " + error; }
                else { message = "Something went wrong trying to rename this delegation. " + error; }
                growl.addErrorMessage(message);
            });
        };

        $scope.getOtherAttendees = function(){
            $log.debug('Retrieving other Attendees');

            var promise = AttendeeService.getAttendees($scope.event);
            promise.then(function(attendees) {
                for (var i = 0; i < attendees.length; i++) {
                    if (attendees[i].AttendeeID == $scope.attendee.AttendeeID) {
                        $log.debug('Removing Attendee with AttendeeID: ' + attendees[i].AttendeeID);
                        var attendeeIndex = attendees.indexOf(attendees[i]);
                        attendees.splice(attendeeIndex, 1);
                    }
                }
                
                $scope.attendees = attendees;
            })
            .catch (function(error) {
                $log.warn(error);
                growl.addErrorMessage("Something went wrong trying to get Attendees");
            });
        };

        // Controller initialization
        (function() {
            $scope.profile = SessionService.get('profile');
            $scope.event = SessionService.get('event');
            $scope.attendee = SessionService.get('attendee');

            // Get this Attendee
            $log.debug('Retrieving Attendee record');
            var selectedAttendeeID = $routeParams.attendeeID;
            var promise = AttendeeService.getAttendee(selectedAttendeeID);

            promise.then(function(selectedAttendee) {
                $scope.selectedAttendee = selectedAttendee;
                $scope.isEditingSelf = $scope.attendee.AttendeeID == selectedAttendee.AttendeeID;
            })
            .catch (function(error) {
                $log.warn(error);
                growl.addErrorMessage("Something went wrong trying to get this Attendee");
            });
        })();
}]);
