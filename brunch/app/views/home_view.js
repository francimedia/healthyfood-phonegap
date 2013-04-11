var View     = require('./view')
  , template = require('./templates/home')
  , mymap   = require('lib/mymap')
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

    	connection.check();
    	
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

    	var map = mymap.init(this.$('#map-small'));

		this.$('#map-overlay').click(function(event) {
			$('#map-small').animate({
				height: $(window).height() - $('header').height()
			}, 250, 'swing', function() {
				$('#map-overlay').hide();
				mymap.fireResize();

				$('header').click(function(event) {
					$('#map-small').animate({
						height: 200
					}, 250, 'swing', function() {
						$('#map-overlay').show();
						console.log($('#map-overlay'));
						mymap.fireResize();
						mymap.centerUserMarker();
					}); 
				});    	


			}); 
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
