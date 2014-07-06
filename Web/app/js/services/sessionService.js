'use strict';

angular.module('yieldtome.services')

.service('SessionService', ['$log', '$window',
    function($log, $window) {

        this.set = function(key, value)
        {
            $log.debug('Saving to session- ' + key + ':' + value);
            $window.sessionStorage[key] = JSON.stringify(value);
        };

        this.get = function(key)
        {
            // $log.debug('Retrieving from session- ' + key);
            var value = $window.sessionStorage[key];

            if(value != undefined && value != "undefined")
                { value = JSON.parse(value); }

            // $log.debug(key + ':' + value);          
            return value;
        };
    }
]);
