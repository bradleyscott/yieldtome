'use strict';

describe('The DirectMessage controller', function() {

    var $controller, $log, $scope, $location, $routeParams, $q, $modal, growl, SessionService, AttendeeService, ChatService;

    beforeEach(function() {
        module('yieldtome.services');
        module('yieldtome.controllers');

        inject(function($rootScope, _$log_, _$controller_, _$q_, _$location_, _SessionService_) {
            $scope = $rootScope.$new();
            $q = _$q_;
            $controller = _$controller_;
            $log = _$log_;
            $location = _$location_;
            SessionService = _SessionService_;

            // Create Mocks 
            $location = jasmine.createSpyObj('$location', ['path']);
            $modal = jasmine.createSpyObj('$modal', ['open']);
            AttendeeService = jasmine.createSpyObj('AttendeeService', ['getAttendee']);
            ChatService = jasmine.createSpyObj('ChatService', ['subscribeToMessages', 'getMessages', 'sendMessage']);
            growl = jasmine.createSpyObj('growl', ['addInfoMessage', 'addErrorMessage']);
        });
    });

    function initializeController() {
        $routeParams = { attendeeID: 1 };
        SessionService.set('profile', 'ValidProfile'); // Set authenticatedProfile
        SessionService.set('event', 'ValidEvent'); // Set event
        SessionService.set('attendee', { AttendeeID: 1 }); // Set event

        // Initialise the controller
        // $scope, $location, $log, $routeParams, growl, SessionService, ChatService, AttendeeService
        $controller('DirectMessage', {
            $scope: $scope,
            $location: $location,
            $log: $log,
            $routeParams: $routeParams,
            $modal: $modal,
            growl: growl,
            SessionService: SessionService,
            AttendeeService: AttendeeService,
            ChatService: ChatService
        });        
    }

    describe('when it initiaties', function() {

        it("should display an error if it can not find the Attendee provided", function(){
            var getAttendeeResponse = $q.defer();
            getAttendeeResponse.reject('EpicFail');

            AttendeeService.getAttendee.andReturn(getAttendeeResponse.promise);
            initializeController();

            $scope.$digest();

            expect(growl.addErrorMessage).toHaveBeenCalled();
        });

        it("should display an error if it can not get DirectMessages between Attendees", function(){
            
            var getAttendeeResponse = $q.defer();
            getAttendeeResponse.resolve({ AttendeeID: 1 });
            AttendeeService.getAttendee.andReturn(getAttendeeResponse.promise);

            var getMessagesResponse = $q.defer();
            getMessagesResponse.reject('EpicFail');
            ChatService.getMessages.andReturn(getMessagesResponse.promise);

            initializeController();
            $scope.$digest();

            expect(growl.addErrorMessage).toHaveBeenCalled();
        });

        it("should display messages to screen", function(){
            
            var getAttendeeResponse = $q.defer();
            getAttendeeResponse.resolve({ AttendeeID: 1 });
            AttendeeService.getAttendee.andReturn(getAttendeeResponse.promise);

            var getMessagesResponse = $q.defer();
            var messages = [ { "senderID": 23, "recipientID": 44, "message": "Oh, noe, all my messages are gone", "createdAt": "2014-12-31T01:00:17.401Z", "updatedAt": "2014-12-31T01:00:17.401Z", "id": "54a34aa1d29633b80c056e4a" } ];
            getMessagesResponse.resolve(messages);

            ChatService.getMessages.andReturn(getMessagesResponse.promise);

            initializeController();
            $scope.$digest();

            expect($scope.messages.length).toBe(1);
        });        
    });

    describe('should have a sendMessage() function', function() {

        beforeEach(function(){
            var getAttendeeResponse = $q.defer();
            getAttendeeResponse.resolve({ AttendeeID: 1 });
            AttendeeService.getAttendee.andReturn(getAttendeeResponse.promise);

            var getMessagesResponse = $q.defer();
            var messages = [ { "senderID": 23, "recipientID": 44, "message": "Oh, noe, all my messages are gone", "createdAt": "2014-12-31T01:00:17.401Z", "updatedAt": "2014-12-31T01:00:17.401Z", "id": "54a34aa1d29633b80c056e4a" } ];
            getMessagesResponse.resolve(messages);

            ChatService.getMessages.andReturn(getMessagesResponse.promise);

            initializeController();
            $scope.$digest();
         });

        it("that should not do anything if there is no message to send", function(){
            $scope.sendMessage("");

            expect(ChatService.sendMessage).not.toHaveBeenCalled();
        });

        it("that should display an error to screen if it can not send", function(){
            var sendMessageResponse = $q.defer();
            sendMessageResponse.reject('EpicFail');
            ChatService.sendMessage.andReturn(sendMessageResponse.promise);

            $scope.sendMessage("Test message");
            $scope.$digest();

            expect(growl.addErrorMessage).toHaveBeenCalled();
        });

        it("that should send a message and display the latest messages to screen", function(){
            var sendMessageResponse = $q.defer();
            sendMessageResponse.resolve({ "senderID": 23, "recipientID": 44, "message": "Successful test message", "createdAt": "2014-12-31T01:00:17.401Z", "updatedAt": "2014-12-31T01:00:17.401Z", "id": "54a34aa1d29633b80c056e4a" });
            ChatService.sendMessage.andReturn(sendMessageResponse.promise);

            var getMessagesResponse = $q.defer();
            var messages = [ { "senderID": 23, "recipientID": 44, "message": "Oh, noe, all my messages are gone", "createdAt": "2014-12-31T01:00:17.401Z", "updatedAt": "2014-12-31T01:00:17.401Z", "id": "54a34aa1d29633b80c056e4a" }, { "senderID": 23, "recipientID": 44, "message": "Successful test message", "createdAt": "2014-12-31T01:00:17.401Z", "updatedAt": "2014-12-31T01:00:17.401Z", "id": "54a34aa1d29633b80c056e4a" } ];
            getMessagesResponse.resolve(messages);
            ChatService.getMessages.andReturn(getMessagesResponse.promise);

            $scope.sendMessage("Test message");
            $scope.$digest();
            
            expect($scope.messages.length).toBe(2);
        });
    });
});