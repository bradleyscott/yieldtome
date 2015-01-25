// 'use strict';

describe('The Delete Event dialog', function() {
    var listPage = require('./listEventsPage.js');
    var editPage = require('./editEventPage.js');

    var numberOfEvents;
    it('should allow the user to change their mind about deletion', function() {
        listPage.open();
        numberOfEvents = listPage.eventList.count();
        listPage.editEvent('last');
        editPage.showDeleteConfirmation();
        editPage.cancelDeleteEvent();
        expect(browser.getLocationAbsUrl()).toContain("/editEvent");
    });

    it('should allow the user to confirm deletion', function(){
        editPage.deleteEvent();
        expect(browser.getLocationAbsUrl()).toContain("/events");
        expect(listPage.eventList.count()).toBeLessThan(numberOfEvents);
    });
});
