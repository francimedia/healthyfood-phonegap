var View     = require('./view')
  , template = require('./templates/home')
  // , mymap   = require('lib/mymap')
  , mymapbox   = require('lib/mymapbox')
  , myfb   = require('lib/myfb')
  , mymenu   = require('lib/mymenu')
  , picture   = require('lib/picture')
  , connection   = require('lib/connection')

module.exports = View.extend({
    id: 'home-view',
    template: template,

 
    render: function(){
        this.$el.html(this.template(this));
        this.afterRender();
        return this;
    },

    afterRender: function() {

    	this.$('#content').height($('html').height() - $('header').height());


		var queue = false;
		var queues = [];


		// document.getElementById('box').scrollTop
		setTimeout(function(){
			var scrollVal = 150;
			$('#content').scrollTo(scrollVal);
			setTimeout(function(){
				$('#map-small').transition({ y: (scrollVal/2)-(offset*1.5)}, 100, 'ease');
			},100);
		},200);

		this.$('#content').scroll(function(eventData) {


		  var offset = mymapbox.offset * -0.65; 

		  var scrollVal = $('#content').scrollTop();

		  if(scrollVal < 500) {
		  	queue = true;
		  	// var height = 200-(scrollVal);
		  	// console.log(height);
		  	// $('#map-small').transition({ y: 10 * Math.round(scrollVal/20)}, 10, 'ease');
			
			var animationTime = 250;

		  	// check whether no new scroll request is coming in
			setTimeout(function() {
				// reset queue > execute scroll
		  		queue = false;
		  	}, animationTime-10);

			// add scrolling animation to queue
			queues.push(function() {
		  		// $('#map-small').transition({ y: 5 * Math.round(scrollVal/10)}, 200, 'ease');
		  		$('#map-small').transition({ y: (scrollVal/2)-(offset*1.5)}, animationTime, 'ease');
		  	});

		  	// check the queue after 200ms
		  	setTimeout(function() {
		  		
		  		// new scroll invoked, so please wait..
		  		if(queue || queues.length == 0) {
		  			return;
		  		}

		  		// execute the latest queue
		  		console.log(queues);
		  		queues[(queues.length-1)]();

		  		// reset queue
		  		queues = [];
		  	}, animationTime);
		  	
		  	// mymapbox.mbox.setSize({x: $('#map-small').width(), y: height});
		  	// mymapbox.centerUserMarker();
		  }
		});    	

    	// var map = mymap.init(this.$('#map-small'));
    	var map = mymapbox.init('map-small');

    	// connection.check();
    	
 		mymenu.init(this);

 		var fbLoginButtonCallback = function(response) {
			  if (response.status === 'connected') {
			    // the user is logged in and has authenticated your
			    // app, and response.authResponse supplies
			    // the user's ID, a valid access token, a signed
			    // request, and the time the access token 
			    // and signed request each expire
			    var uid = response.authResponse.userID;
			    var accessToken = response.authResponse.accessToken;

			      // alert(response.authResponse.userID);
    			FB.api('/me', function(response) {
			     //  alert('Good to see you, ' + response + '.');
			    //   alert('Good to see you, ' + response.name + '.');
			     });			    
			  } else if (response.status === 'not_authorized') {
			    // the user is logged in to Facebook, 
			    // but has not authenticated your app
			    $('#facebook-login').show();
			  } else {
			    // the user isn't logged in to Facebook.
			    $('#facebook-login').show();
			  } 			
 		};

    	if(isMobile != null) {
    		var callback = function() {
				CDV.FB.getLoginStatus(function(response) {
					fbLoginButtonCallback(response);
				}, function() {
					alert('fail');
				});  
			}; 
		} else {
			var callback = function() {
				FB.getLoginStatus(function(response) {
					fbLoginButtonCallback(response);
				}, function() {
					alert('fail');
				});   
			};
		}

		myfb.init(callback);

		this.$('#map-small').height($(window).height() - $('header').height());
		// this.$('#venue-list').height($(window).height() - $('header').height() - 200);

		this.$('header').click(function(event) {
			$('#map-overlay').show();
 			$('#venue-list').transition({ y: 0 }, 600, function() {
 				mymapbox.setMapSizeSmall();
 				mymapbox.centerUserMarker();
 			});
		});

		this.$('#map-overlay').click(function(event) {
			$('#map-overlay').hide();
			$('#map-small').height($(window).height() - $('header').height());
			mymapbox.setMapSizeLarge();
			$('#venue-list').transition({ y: $('#venue-list').height() }, 1000);
		});    	

		this.$('#take-picture').click(function(event) {
			picture.take();
		});    		


		this.$('#facebook-login').click(function(event) {
			var scope = 'email';
	    	if(isMobile == null) {
				FB.login(function(response) {
				   if (response.authResponse) {
				     console.log('Welcome!  Fetching your information.... ');
				     FB.api('/me', function(response) {
				       console.log('Good to see you, ' + response.name + '.');
				     });
				   } else {
				     console.log('User cancelled login or did not fully authorize.');
				   }
				 }, {
					'scope': scope
				});
				return;
			}
			
			CDV.FB.login({
				'scope': scope
			}, function(response) {

			   if (response.authResponse) {
			     alert('Welcome!  Fetching your information.... ');
			     FB.api('/me', function(response) {
			       alert('Good to see you, ' + response.name + '.');
			     });
			   } else {
			     alert('User cancelled login or did not fully authorize.');
			   }
			}, function(response) {
				alert('fail');
				alert(response);
			});

		});  

    },

});
