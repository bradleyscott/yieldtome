// 'use strict';

describe('The Home page', function() {
    var page = require('./homePage.js');

    it('should allow the user to login with Google', function() {
        page.open();
        page.loginWithGoogle();
        expect(browser.getLocationAbsUrl()).toMatch("/events");
    });

    it('should allow the user to logout once Authenticated', function() {
        page.logoutButton.click();
        expect(browser.getLocationAbsUrl()).toMatch("/");
    });

    it('should allow the user to login with Facebook', function() {
        page.loginWithFacebook();
        expect(browser.getLocationAbsUrl()).toMatch("/events");
    });
});
