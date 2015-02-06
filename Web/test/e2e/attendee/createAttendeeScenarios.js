// 'use strict';

describe('The Create Attendee page', function() {
    var eventPage = require('../event/listEventsPage.js');
    var attendeePage = require('./editAttendeePage.js');

    it('should be accessible by clicking on the Edit Event button', function() {
        eventPage.open();
        eventPage.attendEvent('last'); // Assumes the user is not Attending the last event
        expect(browser.getLocationAbsUrl()).toContain("/attend");
    });

    it('should allow the user to return to the Event list', function(){
        attendeePage.backButton.click();
        expect(browser.getLocationAbsUrl()).toContain("/events");
    });

    it('should not allow a delegation with no name', function(){
        eventPage.attendEvent('last'); // Assumes the user is not Attending the last event
        expect(attendeePage.saveButton.isEnabled()).toBeFalsy();
    });

    it('should allow the creation of a new delegation', function(){
        attendeePage.editAttendee('Test delegation');
        expect(browser.getLocationAbsUrl()).toContain("/attendees");
    });
});
