//'use strict';

describe('The EventService', function() {

    var $q, $httpBackend, EventService, ConfigService;

    beforeEach(function() {
        module('yieldtome.services');
        module('yieldtome.controllers');
        
        inject(function(_$q_, _$httpBackend_, _EventService_, _ConfigService_) {
            $q = _$q_;
            $httpBackend = _$httpBackend_;
            EventService = _EventService_;
            ConfigService = _ConfigService_;
        });
   
    });

    describe('has a getEvents function', function() {

        beforeEach(function() {

            var url = ConfigService.apiUrl + 'Events';

            $httpBackend.expectGET(url). // Mock a valid response
                respond([
                    {
                        "EventID": 1,
                        "Name": "New Event",
                        "Hashtag": "newevent",
                        "StartDate": "2014-04-20T08:54:11.75",
                        "EndDate": "2014-10-22T08:54:11.75",
                        "CreatorID": 1,
                        "Description": "Description",
                        "DateDescription": "Today",
                        "DisplayDate": "20 Apr to 22 Oct 2014"
                    },
                    {
                        "EventID": 2,
                        "Name": "Another New Event",
                        "Hashtag": "anotherevent",
                        "StartDate": "2014-04-20T08:54:11.953",
                        "EndDate": "2014-10-22T08:54:11.953",
                        "CreatorID": 1,
                        "Description": "Description",
                        "DateDescription": "Today",
                        "DisplayDate": "20 Apr to 22 Oct 2014"
                    }
                ]); 
        });

        it("that exists", function() {
            expect(angular.isFunction(EventService.getEvents)).toBe(true);
        });

        it("that should return Events", function() {
            var eventPromise = EventService.getEvents(); 

            eventPromise.then(function(events) {
                expect(false).toBeTruthy(); // This should fail
                expect(events).not.toBeNull();
                expect(events.length).toBe(2);
            });
                       
        });

        it("that should return Events ordered by soonest first", function() {
            var eventPromise = EventService.getEvents(); 
            eventPromise.then(function(events) {
                var date1 = events[0].StartDate;
                var date2 = events[1].StartDate;

                var isEarlier = dates.compare(date1, date2); // Should be -1 if date1 is earlier
                expect(isEarlier.toBe(-1)); 
            }); 
        });

        it("that should display an error if something catastrophic happens", function() {
            var url = ConfigService.apiUrl + 'Events';
            $httpBackend.expectGET(url).respond(500, 'EpicFail'); // Mock an error

            var eventPromise = EventService.getEvents(); 
            eventPromise.then().catch(function(error)
            {
                expect(error.toBe('EpicFail'));
            });
        });

    });

});

