// 'use strict';

// /* jasmine specs for services go here */

describe('The FacebookService', function() {

    var $q, Facebook, FacebookService;

    beforeEach(function() {
        module('yieldtome.services', function($provide) {
            Facebook = jasmine.createSpyObj('Facebook', ['getLoginStatus', 'login', 'api']); // Create Mocks 
            $provide.value('Facebook', Facebook);
        });

        inject(function(_$q_, _FacebookService_) {
            $q = _$q_;
            FacebookService = _FacebookService_;
        });
    });

    describe('has a getFacebookToken function', function() {

        it("that should exist", function() {
            expect(angular.isFunction(FacebookService.getFacebookToken)).toBe(true);
        });

        it("that should return an ApiToken if Facebook is connected and authorized", function() {
            var getLoginStatusResponse = $q.defer();
            getLoginStatusResponse.resolve( // Mock out the authResponse from Facebook
                {
                    status: 'connected',
                    authResponse: {
                        accessToken: 'ValidToken'
                    }
                });
            Facebook.getLoginStatus.andReturn(getLoginStatusResponse.promise);

            var loginStatusPromise = FacebookService.getFacebookToken();
            loginStatusPromise.then(function(token) {
                expect(false).toBeTruthy(); // If this test passes, there is something going wrong!
                expect(token).not.toBeNull(); // The token should be ValidToken
                expect(token).toBe('ValidToken');
            });
        });

    });

    // getUserInfo
});
