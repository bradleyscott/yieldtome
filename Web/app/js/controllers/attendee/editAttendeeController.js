'use strict';

angular.module('yieldtome.controllers')

.controller('EditAttendee', ['$scope', '$location', '$log', '$window', '$modal', '$routeParams', 'growl', 'SessionService', 'AttendeeService',
    function($scope, $location, $log, $window, $modal, $routeParams, growl, SessionService, AttendeeService) {

        $log.debug("EditAttendee controller executing");

        $scope.title = 'Change attendance';
        $scope.alternatebutton = 'Back';
        $scope.event;
        $scope.profile;
        $scope.attendee;
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
            var promise = AttendeeService.deleteAttendee($scope.attendee);

            promise.then(function(data) {
                $log.debug('Attendee deleted after deleteAttendee()');
                growl.addInfoMessage("You are no longer representing " + $scope.attendee.Name);
                $location.path('/events');
            })            
            .catch (function(error) {
                $log.warn(error);
                growl.addErrorMessage("Something went wrong trying to remove yourself from this delegation");
            });                
        };

        $scope.save = function() // Edit Poll
        {
            $log.debug('EditAttendee.save() starting');

            var promise = AttendeeService.updateAttendee($scope.attendee);

            promise.then(function(attendee) { // It all went well 
                $scope.attendee = attendee;
                growl.addInfoMessage('You successfully renamed your delegation to ' + attendee.Name);
                $location.path('/attendees'); // Redirect
            })
            .catch (function(error) { // The service crapped out
                $log.warn(error);
                growl.addErrorMessage("Something went wrong trying to rename your delegation. " + error);
            });
        };

        // Controller initialization
        (function() {
            $scope.profile = SessionService.get('profile');
            $scope.event = SessionService.get('event');

            var attendeeID = $routeParams.attendeeID;
            var promise = AttendeeService.getAttendee(attendeeID);

            promise.then(function(attendee) {
                $scope.attendee = attendee;
            })
            .catch (function(error) {
                $log.warn(error);
                growl.addErrorMessage("Something went wrong trying to get this Attendee");
            });
        })();
}]);
