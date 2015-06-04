Template.ytm_home_nav.helpers({});

Template.ytm_home_nav.events({

    'click #logout': function() {
        console.log('Logout button clicked');
        Meteor.logout();
        Meteor._reload.reload(); // Dirty hack to get dropdowns working again
    }
});
