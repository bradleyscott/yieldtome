var EditProfilePage = function() {

    this.profileMenu = element(by.id('profileMenu'));
    this.nameInput = element(by.model('profile.Name'));
    this.emailInput = element(by.model('profile.Email'));
    this.phoneInput = element(by.model('profile.Phone'));
    this.twitterInput = element(by.model('profile.Twitter'));
    this.saveButton = element(by.id('saveButton'));
    this.backButton = element(by.id('backButton'));

    this.open = function(){
        this.profileMenu.click();
    };

    this.editProfile = function(name, email, phone, twitter) {
        if(name) {
            this.nameInput.clear();
            this.nameInput.sendKeys(name);
        }

        if(email)
        {
            this.emailInput.clear();
            this.emailInput.sendKeys(email);
        }

        if(phone)
        {
            this.phoneInput.clear();
            this.phoneInput.sendKeys(phone);
        }

        if(twitter)
        {
            this.twitterInput.clear();
            this.twitterInput.sendKeys(twitter);
        }
    };

    this.saveProfile = function() {
        this.saveButton.click();
    };
};

module.exports = new EditProfilePage();
