'use strict';

angular.module('yieldtome.controllers')

.controller('EditEvent', ['$scope', '$location', '$log', '$window', '$routeParams', '$filter', 'SessionService', 'EventService',
    function($scope, $location, $log, $window, $routeParams, $filter, SessionService, EventService) {

        $log.debug("EditEvent controller executing");

        $scope.title = 'Edit Event';
        $scope.alternatebutton = 'Back';
        $scope.error; // An error message that will be displayed to screen
        $scope.info; // An info message that will be displayed to screen
        $scope.event;
        $scope.startDateAsString; // Post formatted date for binding
        $scope.endDateAsString; // Post formatted date for binding
        $scope.profile;
        $scope.isDeleteEnabled = true; // Enables the Delete button

        $scope.$back = function() {
            $window.history.back();
        };

        $scope.delete = function() {
            $log.debug('EditEvent.delete() starting');
            $scope.error = '';

            var promise = EventService.deleteEvent($scope.event);

            promise.then(function(data) // It all went well
                {
                    $scope.info = 'You just deleted ' + $scope.event.Name;
                    $location.path('/events'); // Redirect to events page
                })
            .catch (function(error) { // The service crapped out
                $scope.error = "Something wen't wrong trying to delete your Event. " + error;
            });

            // Dirty hack to close the modal properly
            $('.modal-backdrop').remove();
        };

        $scope.save = function() // Edit Profile
        {
            $log.debug('EditEvent.save() starting');
            $scope.error = '';

            var promise = EventService.editEvent($scope.event);

            promise.then(function(event) // It all went well
                {
                    SessionService.set('event', event); // Saves in session
                    $scope.info = 'Your Event updates just got saved';
                })
            .catch (function(error) { // The service crapped out
                $scope.error = "Something wen't wrong trying to edit your Event. " + error;
            });
        };

        // Controller initialization
        (function() {
            // Allocate the saved Profile to the controller
            $scope.profile = SessionService.get('profile');

            var eventID = $routeParams.eventID;
            var promise = EventService.getEvent(eventID);

            promise.then(function(event) {
                $scope.event = event;

                // Set UI binding properties
                $scope.startDateAsString = $filter('date')(event.StartDate, 'yyyy-MM-dd');
                $scope.endDateAsString = $filter('date')(event.EndDate, 'yyyy-MM-dd');

                // Watch UI bound elements to bind to model
                $scope.$watch("startDateAsString", function(value) {
                    $log.debug('Start Date value changed to: ' + value);
                    $scope.event.StartDate = new Date(value);
                });

                $scope.$watch("endDateAsString", function(value) {
                    $log.debug('End Date value changed to: ' + value);
                    $scope.event.EndDate = new Date(value);
                });

            })
            .catch (function(error) {
                $log.warn(error);
                $scope.error = "Something wen't wrong trying to get this Event";
            });
        })();

    }
]);
