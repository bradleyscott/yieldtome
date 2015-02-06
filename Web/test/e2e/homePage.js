var HomePage = function() {

    this.loginButton = element(by.id('loginButton'));
    this.loginMenu = element(by.id('loginMenu'));
    this.logoutMenu = element(by.id('logoutMenu'));
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

    this.logout = function(){
    	this.logoutMenu.click();
    };
};

module.exports = new HomePage();
