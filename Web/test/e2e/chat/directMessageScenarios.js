//'use strict';

describe('The Direct messages page', function() {
    var page = require('./directMessagesPage.js');
    var attendeesPage = require('../attendee/listAttendeesPage.js');
    
    it('should be accessible by clicking on an Attendee', function() {
        attendeesPage.open();
        attendeesPage.chatWithAttendee('first');
        expect(browser.getLocationAbsUrl()).toContain("/chat");
    });

    it('should display messages sent and received', function() {
        expect(page.messagesList.count()).toBeGreaterThan(0); // Assumes there is at least 1 message already
    });

    describe('should allow the User to send a message', function() {

        it('but cancel before sending', function() {
            var messageCount = page.messagesList.count();
            page.cancelSendMessage();
            expect(page.messagesList.count()).toBe(messageCount);
        });

        it('and see it in the message list', function() {
            var messageCount = page.messagesList.count();
            page.sendMessage('A e2e test message');
            expect(page.messagesList.count()).toBeGreaterThan(messageCount);
        });
    });
});
