'use strict';

/* Controllers */

angular.module('yieldtome.controllers')

.controller('EventList', ['$scope', '$location', '$log', 'AuthenticationService', 'EventService',
    function($scope, $location, $log, AuthenticationService, EventService) {

        $log.debug("EventList controller executing");

        $scope.error; // An error message that will be displayed to screen
        $scope.info; // An info message that will be displayed to screen
        $scope.events; // List of Events

        $scope.$back = function() {
            window.history.back();
        };

        // Get Events from EventService
        (function() {
            $log.debug('Retrieving Events to create model');
            var promise = EventService.getEvents();

            promise.then(function(events) {
                $scope.events = events;
            })
                .
            catch (function(error) {
                $log.warn(error);
                $scope.error = "Something wen't wrong trying to get the list of yieldto.me Events";
            });
        })();
    }
]);
