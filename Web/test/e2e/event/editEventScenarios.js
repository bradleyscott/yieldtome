// 'use strict';

describe('The Edit Event page', function() {
    var listPage = require('./listEventsPage.js');
    var editPage = require('./editEventPage.js');

    it('should be accessible by clicking on the Edit Event button', function() {
        listPage.open();
        listPage.editEvent('first'); // Assumes the user has rights to edit the first event in the list
        expect(browser.getLocationAbsUrl()).toContain("/editEvent");
    });

    it('should allow the User to save changes to Event details', function() {
        editPage.getCurrentEventDetails().then(function(value) {
            var newName = value;
            if (newName.indexOf('-tested') != -1) { // Remove test from name if it already is there
                newName = newName.replace('-tested', '');
            }
            newName = newName + '-tested';

            // Unable to update description due to problem with Protractor locator for Description fields
            // var newDescription = value.description;
            // var index = newDescription.indexOf('\nTested on:');
            // if (index != -1) { // Remove any previous tested date-stamp
            //     newDescription = newDescription.substring(0, index);
            // }
            // newDescription = newDescription + '\nTested on: ' + new Date();

            editPage.editEvent(newName, '');
            expect(browser.getLocationAbsUrl()).toContain("/events"); // Check the user is returned to the Events page
            // Trust that unit tests cover off the accurate saving of an Event
        });
    });
});
