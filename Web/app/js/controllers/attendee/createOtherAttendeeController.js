'use strict';

angular.module('yieldtome.controllers')

.controller('CreateOtherAttendee', ['$scope', '$location', '$log', '$window', 'growl', 'SessionService', 'AttendeeService',
    function($scope, $location, $log, $window, growl, SessionService, AttendeeService) {

        $log.debug("CreateOtherAttendee controller executing");

        $scope.title = 'Add Delegation';
        $scope.alternatebutton = 'Cancel';
        $scope.event;
        $scope.profile;
        $scope.selectedAttendee = { Name: '' }; // The Attendee record, including its Name

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

        $scope.save = function()
        {
            $log.debug('AttendController.save() starting');
            var promise = AttendeeService.attendEvent($scope.event, $scope.selectedAttendee.Name);

            promise.then(function(attendee) { // It all went well
                growl.addInfoMessage(attendee.Name + ' is now attending ' + $scope.event.Name); 
                $location.path('/attendees'); // Redirect
            })
            .catch (function(error) { // The service crapped out
                $log.warn(error);
                growl.addErrorMessage("Something went wrong trying to add this delegation. " + error);
            });
        };

        // Controller initialization
        (function() {
            $scope.profile = SessionService.get('profile');
            $scope.event = SessionService.get('event');

            if ($scope.event == "undefined") {
                growl.addErrorMessage("We don't have enough information to allow you to add delegations");
            }
        })();
    }
]);
