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

        xit("that should return an error if no facebookID is provided", function() {});

        xit("that should return an error if an empty facebookID is provided", function() {});

        xit("that should return a Profile if there is one matching that facebookID", function() {});

        xit("that should return an error if there is no Profile matching that facebookID", function() {});

        xit("that should return an error if something catastrophic happens", function() {});

    });

    describe('has a createProfile function', function() {

        it("that exists", function() {
            expect(angular.isFunction(ProfileService.createProfile)).toBe(true);
        });

        xit("that should return an error if no profile is provided", function() {});

        xit("that should return an error if the profile doesn't have at least a Name and a FacebookID", function() {});

        xit("that should return a Profile if the Create is successful", function() {});

        xit("that should return an error if there is no Profile matching that facebookID", function() {});

        xit("that should return an error if something catastrophic happens", function() {});

    });
});
