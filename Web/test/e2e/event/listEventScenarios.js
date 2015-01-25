// 'use strict';

describe('The Event list page', function() {
    var page = require('./listEventsPage.js');
    
    // This test assumes there is at least 1 Event in the DB
    it('should show a list of Events', function() {
        page.open();
        expect(page.eventList.count()).toBeGreaterThan(0);
    });

    it('should allow filtering of Events', function() {
        expect(page.eventsFilter.isPresent()).toBeTruthy();

        var eventCount = page.eventList.count();
        page.filterEvents('filter');
        var filteredEventCount = page.eventList.count();
        expect(filteredEventCount).toBeLessThan(eventCount);

        page.clearEventFilter();
        eventCount = page.eventList.count();
        expect(eventCount).toBeGreaterThan(filteredEventCount);
    });

    // These tests assume that the user is NOT an Attendee of the last event
    describe('should allow the User to click on an Event', function() {

        it('and see the Event name, description and dates', function() {
            page.selectEvent('last');

            expect(page.selectedEventName.isPresent()).toBeTruthy();
            expect(page.selectedEventDescription.isPresent()).toBeTruthy();
            expect(page.selectedEventDates.isPresent()).toBeTruthy();
        });

        it('and see the Attendees list', function() {
            expect(page.selectedEventAttendees.count()).toBeGreaterThan(0); // Assumes there is at 1 one other Attendee
        });

        it('and filter the list of Attendees', function() {
            if (attendeesCount > 10) { // This test is not relevant if there are less than 10 Attendees

                var attendeesCount = page.selectedEventAttendees.count();
                expect(page.selectedEventAttendeesFilter).toBeTruthy();

                page.filterAttendees('filter');
                var filteredAttendeesCount = page.selectedEventAttendees.count();
                expect(filteredAttendeesCount).toBeLessThan(attendeesCount);

                page.clearAttendeeFilter();
                attendeesCount = page.selectedEventAttendees.count();
                expect(attendeesCount).toBeGreaterThan(filteredAttendeesCount);
            }
        });

        it('and then return back to the Event list', function() {
            expect(page.clearEventButton.isPresent()).toBeTruthy();
            page.clearEventButton.click();
            expect(page.eventList.count()).toBeGreaterThan(0);
        });
    });
});
