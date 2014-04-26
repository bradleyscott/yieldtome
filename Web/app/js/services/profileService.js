'use strict';

/* Services */

angular.module('yieldtome.services')

.service('ProfileService', function(ConfigService, $q, $http) {

    this.createProfile = function(profile)
    {
        console.log('Attempting to create a new Profile');
        var deferred = $q.defer();

        if (profile == null) {
            var error = 'A Profile object is needed';
            console.log(error);
            deferred.reject(error);
            return deferred.promise;
        }
        else if(profile.FacebookID == null || profile.Name == null)
        {
            var error = 'Both FacebookID and Name are mandatory fields on a Profile';
            console.log(error);
            deferred.reject(error);
            return deferred.promise;
        }

        console.log('Attempting to create a Profile associated with FacebookID: ' + profile.FacebookID);

        var url = ConfigService.apiUrl + 'Profiles';
        console.log('Request Url: ' + url);

        $http.post(url, profile).success(function(data) {
            console.log('New Profile created with ProfileID: ' + data.ProfileID);
            deferred.resolve(data);
        }).error(function(status) { // Otherwise, some unknown error occured
            var error = 'Problem creating this Profile. ' + status;
            console.log(error);
            deferred.reject(error);
        });

        return deferred.promise;
    };

    this.getProfileByFacebookID = function(facebookID) {

        console.log('Attempting to get the Profile associated with FacebookID: ' + facebookID);
        var deferred = $q.defer();

        if (facebookID.length == 0 || facebookID == null) {
            deferred.reject('Facebook ID must be provided');
            return deferred.promise;
        }

        var url = ConfigService.apiUrl + 'Profiles?facebookID=' + facebookID;
        console.log('Request Url: ' + url);

        $http.get(url).success(function(data) {

            if (data == "null") // No profile yet exists associated with this Facebook ID
            {
                var error = 'No profile associated with FacebookID: ' + facebookID;
                console.log(error);
                deferred.resolve(null);
            } else // Otherwise, there is a Profile associated with this Facesbook ID
            {
                console.log('yieldto.me profile: ' + data.ProfileID);
                deferred.resolve(data);
            }

        }).error(function(status) { // Otherwise, some unknown error occured
            var error = 'Problem getting Profile. ' + status;
            console.log(error);
            deferred.reject(error);
        });

        return deferred.promise;
    };

});
