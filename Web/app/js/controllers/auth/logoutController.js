'use strict';

/* Controllers */

angular.module('yieldtome.controllers')

.controller('Logout', ['$log', '$location', 'growl', 'AuthenticationService',
    function($log, $location, growl, AuthenticationService) {

        $log.debug("Logout controller executing");

        // Controller initialize
        (function() {
            AuthenticationService.logOut(); // Log the user out  
            growl.addInfoMessage("You have been logged out");

            $log.debug("Redirecting to landing page");
            $location.path("/");
       	})();
    }
]);
