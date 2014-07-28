'use strict';

angular.module('yieldtome.controllers')

.controller('CreateEvent', ['$scope', '$location', '$log', '$filter', '$window', 'growl', 'SessionService', 'EventService',
    function($scope, $location, $log, $filter, $window, growl, SessionService, EventService) {

        $log.debug("CreateEvent controller executing");

        $scope.title = 'Create Event';
        $scope.alternatebutton = 'Cancel';
        $scope.event;
        $scope.profile;
        $scope.startDateAsString; // Post formatted date for binding
        $scope.endDateAsString; // Post formatted date for binding

        $scope.$back = function() {
            $window.history.back();
        };

        // Watch UI bound elements to bind to model
        $scope.$watch("startDateAsString", function(value) {
            $log.debug('Start Date value changed to: ' + value);
            $scope.event.StartDate = new Date(value);
        });

        $scope.$watch("endDateAsString", function(value) {
            $log.debug('End Date value changed to: ' + value);
            $scope.event.EndDate = new Date(value);
        });

        $scope.save = function() // Create a new Profile
        {
            $log.debug('CreateEvent.save() starting');
            var promise = EventService.createEvent($scope.event);

            promise.then(function(event) { // It all went well
                SessionService.set('event', event); // Saves the Event in session
                growl.addInfoMessage("You successfully created " + event.Name);
                $location.path('/events'); // Redirect to the Event menu page
            })
            .catch (function(error) { // The service crapped out
                $log.warn(error);
                growl.addErrorMessage("Something went wrong trying to create your Event. " + error);
            });
        };

        (function() {
            $log.debug('Create an Event model with default values');

            // Allocate the saved Profile to the controller
            $scope.profile = SessionService.get('profile');

            var today = new Date();
            var event = {
                Name: 'New Event',
                StartDate: today,
                EndDate: today,
                CreatorID: $scope.profile.ProfileID
            };

            // Set UI binding properties
            $scope.startDateAsString = $filter('date')(event.StartDate, 'yyyy-MM-dd');
            $scope.endDateAsString = $filter('date')(event.EndDate, 'yyyy-MM-dd');

            $scope.event = event;
        })();

    }
]);
