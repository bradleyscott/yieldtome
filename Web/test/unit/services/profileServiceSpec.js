'use strict';

describe('The ProfileService', function() {

    var $q, $httpBackend, ProfileService, ConfigService;

    beforeEach(function() {
        module('yieldtome.services');

        inject(function(_$q_, _$httpBackend_, _ProfileService_, _ConfigService_) {
            $q = _$q_;
            ProfileService = _ProfileService_;
            $httpBackend = _$httpBackend_;
            ConfigService = _ConfigService_;
        });

    });

    describe('has a getProfileByFacebookID function', function() {

        it("that exists", function() {
            expect(angular.isFunction(ProfileService.getProfileByFacebookID)).toBe(true);
        });

        it("that should return an error if no facebookID is provided", function() {
            var getProfilePromise = ProfileService.getProfileByFacebookID();
            getProfilePromise.then(function(error) {
                expect(error).toBe('A Profile object is needed');
            });
        });

        it("that should return an error if an empty facebookID is provided", function() {
            var getProfilePromise = ProfileService.getProfileByFacebookID('');
            getProfilePromise.then(function(error) {
                expect(error).toBe('A Profile object is needed');
            });
        });

        it("that should return a Profile if there is one matching that facebookID", function() {

            var url = ConfigService.apiUrl + 'Profiles?facebookID=Exists';

            $httpBackend.expectGET(url). // Mock a valid response
            respond([{
                ProfileID: 1,
                FacebookID: 'Exists'
            }]);

            var getProfilePromise = ProfileService.getProfileByFacebookID('Exists');
            getProfilePromise.then(function(profile) {
                expect(profile.ProfileID).toBe(1);
            });
        });

        it("that should return an error if there is no Profile matching that facebookID", function() {
            var url = ConfigService.apiUrl + 'Profiles?facebookID=DoesntExist';

            $httpBackend.expectGET(url). // Mock a valid response
            respond([]);

            var getProfilePromise = ProfileService.getProfileByFacebookID('DoesntExist');
            getProfilePromise.then(function(error) {
                expect(error).toBe('No profile associated with FacebookID: DoesntExist');
            });
        });

        it("that should return an error if something catastrophic happens", function() {
            var url = ConfigService.apiUrl + 'Profiles?facebookID=EpicFail';
            $httpBackend.expectGET(url).respond(500, 'EpicFail'); // Mock an error

            var getProfilePromise = ProfileService.getProfileByFacebookID('EpicFail');
            getProfilePromise.then(function(error) {
                expect(error).toBe('Problem getting Profile. EpicFail');
            });
        });

    });

    describe('has a createProfile function', function() {

        it("that exists", function() {
            expect(angular.isFunction(ProfileService.createProfile)).toBe(true);
        });

        it("that should return an error if no profile is provided", function() {
            var createProfilePromise = ProfileService.createProfile();
            createProfilePromise.then(function(error) {
                expect(error).toBe('A Profile object is needed');
            });
        });

        it("that should return an error if the profile doesn't have at least a Name and a FacebookID", function() {
            var profile = {};
            var createProfilePromise = ProfileService.createProfile(profile);
            createProfilePromise.then(function(error) {
                expect(error).toBe('Both FacebookID and Name are mandatory fields on a Profile');
            });
        });

        xit("that should return a Profile if the Create is successful", function() {
            // Not adding any more tests until it is discovered how to resolve promises in unit tests
        });

        xit("that should return an error if something catastrophic happens", function() {
            // Not adding any more tests until it is discovered how to resolve promises in unit tests
        });

    });
});
