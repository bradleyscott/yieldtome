Template.ytm_home_main.helpers({});

Template.ytm_home_main.events({
    'click #getStarted': function() {
        console.log('Get started button clicked');
    },

    'click #facebook': function() {
        console.log('Facebook button clicked');
        Meteor.loginWithFacebook();
    },

    'click #google': function() {
        console.log('Google button clicked');
        Meteor.loginWithGoogle();
    },

    'click #twitter': function() {
        console.log('Twitter button clicked');
        Meteor.loginWithTwitter();
    }
});
