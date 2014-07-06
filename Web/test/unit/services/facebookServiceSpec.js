'use strict';

describe('The FacebookService', function() {

    var $q, $scope, Facebook, FacebookService;

    beforeEach(function() {
        module('yieldtome.services', function($provide) {
            Facebook = jasmine.createSpyObj('Facebook', ['getLoginStatus', 'login', 'api']); // Create Mocks 
            $provide.value('Facebook', Facebook);
        });

        inject(function(_$q_, _$rootScope_, _FacebookService_) {
            $q = _$q_;
            FacebookService = _FacebookService_;
            $scope = _$rootScope_;
        });
    });

    describe('has a getFacebookToken function', function() {

        it("that should exist", function() {
            expect(angular.isFunction(FacebookService.getFacebookToken)).toBe(true);
        });

        it("that should return an ApiToken if Facebook is connected and authorized", function() {
            var getLoginStatusResponse = {
                status: 'connected',
                authResponse: {
                    accessToken: 'ValidToken'
                }
            };
            Facebook.getLoginStatus.andReturn(getLoginStatusResponse);

            var loginStatusPromise = FacebookService.getFacebookToken();
            
            $scope.$digest();

            loginStatusPromise.then(function(token) {
                expect(false).toBeTruthy(); // If this test passes, there is something going wrong!
                expect(token).toBe('ValidToken');
            });
        });

        it("that should return an error if user did not authorize yieldto.me", function() {
            var getLoginStatusResponse = {
                status: 'not_authorized'
            };
            Facebook.getLoginStatus.andReturn(getLoginStatusResponse);

            var loginStatusPromise = FacebookService.getFacebookToken();
            $scope.$digest();

            loginStatusPromise.then(function(error) {
                expect(false).toBeTruthy(); // If this test passes, there is something going wrong!
                expect(error).toBe('Unable to retrieve access token because user has not authorized this app');
            });
        });

        it("that should return an ApiToken if the user isn't yet logged in but then does login", function() {

            // Mock a not logged in response
            var getLoginStatusResponse = {
                status: 'not_connected' // Any other status
            };
            Facebook.getLoginStatus.andReturn(getLoginStatusResponse);

            // Mock a successful login
            var loginResponse = {
                status: 'connected',
                authResponse: {
                    accessToken: 'ValidToken'
                }
            };
            Facebook.login.andReturn(loginResponse);

            var loginStatusPromise = FacebookService.getFacebookToken();
            $scope.$digest();

            loginStatusPromise.then(function(token) {
                expect(false).toBeTruthy(); // If this test passes, there is something going wrong!
                expect(token).toBe('ValidToken');
            });
        });


        it("that should return an error if user does not login to Facebook", function() {
            // Mock a not logged in response
            var getLoginStatusResponse = {
                status: 'not_connected' // Any other status
            };
            Facebook.getLoginStatus.andReturn(getLoginStatusResponse);

            // Mock an unsuccessful login
            var loginResponse = {
                status: 'not_connected'
            };
            Facebook.login.andReturn(loginResponse);

            var loginStatusPromise = FacebookService.getFacebookToken();
            $scope.$digest();

            loginStatusPromise.then(function(error) {
                expect(false).toBeTruthy(); // If this test passes, there is something going wrong!
                expect(error).toBe('Still unable to retrieve access token after Login attempt. Status: not_connected');
            });
        });
    });

    describe('has a getUserInfo function', function() {

        beforeEach(function() {
            // Create a spy on FacebookService but pass through to the getUserInfo call
            spyOn(FacebookService, 'getFacebookToken');
        });

        it("that should return a Facebook profile if connected and authorized", function() {
            // Mock a succesful getFacebookToken response
            var getFacebookTokenResponse = $q.defer();
            getFacebookTokenResponse.resolve('1234');
            FacebookService.getFacebookToken.andReturn(getFacebookTokenResponse.promise);

            // Mock a successful Facebook.api /me response
            var facebookApiResponse = 'UserInfo';
            Facebook.api.andReturn(facebookApiResponse);

            // Make the call and do asserts
            var getUserInfoResponse = FacebookService.getUserInfo();
            $scope.$digest();

            getUserInfoResponse.then(function(user) {
                expect(false).toBeTruthy(); // If this test passes, there is something going wrong!
                expect(user).toBe('UserInfo');
            });
        });

        it("that should an error if something catastrophic happens", function() {
            // Mock a succesful getFacebookToken response
            var getFacebookTokenResponse = $q.defer();
            getFacebookTokenResponse.reject('Problem');
            FacebookService.getFacebookToken.andReturn(getFacebookTokenResponse.promise);

            // Make the call and do asserts
            var getUserInfoResponse = FacebookService.getUserInfo();
            $scope.$digest();

            getUserInfoResponse.then(function(error) {
                expect(false).toBeTruthy(); // If this test passes, there is something going wrong!
                expect(user).toBe('Problem');
            });
        });
    });
});
