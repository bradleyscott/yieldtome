// 'use strict';

describe('The Attendee list page', function() {
    var page = require('./listAttendeesPage.js');
    var eventsPage = require('../event/listEventsPage.js');

    // This test assumes there is at least 1 other Attendee in the DB
    it('should show a list of Attendees', function() {
        eventsPage.open();
        eventsPage.selectEvent('first');
        expect(page.attendeeList.count()).toBeGreaterThan(0);
    });

    it('should allow filtering of Attendees', function() {
        expect(page.attendeeFilter.isPresent()).toBeTruthy();

        var attendeeCount = page.attendeeList.count();
        page.filterAttendees('filter');
        var filteredAttendeeCount = page.attendeeList.count();
        expect(filteredAttendeeCount).toBeLessThan(attendeeCount);

        page.clearAttendeeFilter();
        attendeeCount = page.attendeeList.count();
        expect(attendeeCount).toBeGreaterThan(filteredAttendeeCount);
    });
});
