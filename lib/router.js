Router.configure({
    // notFoundTemplate: 'appNotFound',
    // loadingTemplate: 'appLoading',
	layoutTemplate: 'yieldtome-template'
});

Router.route('/', {
		action: function() {
		  this.render('yieldtome-home-mobile-nav', {to: 'mobile-nav'});
		  this.render('yieldtome-home-nav', {to: 'nav'});
		  this.render('yieldtome-home-main', {to: 'main'});  
		},
		onAfterAction: function(){
			$(document).ready(function(){
	    	$('.slider').slider({full_width: true});
	    });
	}
});