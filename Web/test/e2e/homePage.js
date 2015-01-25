var HomePage = function() {

    this.loginButton = element(by.id('loginButton'));
    this.loginMenu = element(by.id('loginMenu'));
    this.logoutButton = element(by.id('logoutButton'));
    this.loginWithFacebookButton = element(by.id('facebookButton'));
    this.loginWithGoogleButton = element(by.id('googleButton'));

    this.open = function(){
    	browser.get('#');
    };

    this.loginWithFacebook = function() {
        this.loginButton.click();
        this.loginWithFacebookButton.click();
    };

    this.loginWithGoogle = function() {
        this.loginButton.click();
        this.loginWithGoogleButton.click();
    };

    this.logOut = function(){
    	this.logoutButton.click();
    };
};

module.exports = new HomePage();
