Router.configure({
    // notFoundTemplate: 'appNotFound',
    // loadingTemplate: 'appLoading',
	layoutTemplate: 'yieldtome_template'
});

Router.route('/', {
		action: function() {
		  this.render('ytm_home_mobile_nav', {to: 'mobile_nav'});
		  this.render('ytm_home_nav', {to: 'nav'});
		  this.render('ytm_home_main', {to: 'main'});  
		},
		onAfterAction: function(){
			$(document).ready(function(){
	    	$('.slider').slider({full_width: true});
	    });
	}
});