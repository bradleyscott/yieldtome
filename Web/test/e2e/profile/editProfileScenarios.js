// 'use strict';

describe('The Edit Profile page', function() {
    var page = require('./editProfilePage.js');

    it('should be accessible by clicking on the Profile menu', function() {
        page.open();
        expect(browser.getLocationAbsUrl()).toContain("/editProfile");
    });

    it('should not allow a Profile with no name', function(){
        page.nameInput.clear();
        page.editProfile(null, 'test@yieldto.me', null, null);
        expect(page.saveButton.isEnabled()).toBeFalsy();
    });

    it('should not allow a delegation with no email address', function(){
        page.emailInput.clear();
        page.editProfile('Test Account', '', null, null);
        expect(page.saveButton.isEnabled()).toBeFalsy();
    });

    it('should allow saving of Profile edits', function(){
        page.editProfile('Test Account', 'test@yieldto.me', null, null);
        page.saveProfile();
        expect(browser.getLocationAbsUrl()).not.toContain("/editProfile");
    });
});
