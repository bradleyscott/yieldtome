// 'use strict';

describe('The Create Event page', function() {
    var listPage = require('./listEventsPage.js');
    var editPage = require('./editEventPage.js');
    var numberOfEvents; 

    it('should be accessible by clicking on the Create Event button', function() {
        listPage.open();
        numberOfEvents = listPage.eventList.count();
        listPage.createEvent();
        expect(browser.getLocationAbsUrl()).toContain("/createEvent");
    });

    it('should allow the user to return to the Event list', function(){
        editPage.backButton.click();
        expect(browser.getLocationAbsUrl()).toContain("/events");
    });

    it('should not allow the user to save an Event with no name', function(){
        listPage.createEvent();
        editPage.nameInput.clear();
        expect(editPage.saveButton.isEnabled()).toBeFalsy();
    });

    it('should allow the user to create a new Event', function(){
        editPage.editEvent('A Test Event');
        expect(browser.getLocationAbsUrl()).toContain("/events");
        expect(listPage.eventList.count()).toBeGreaterThan(numberOfEvents);
    });  
});
