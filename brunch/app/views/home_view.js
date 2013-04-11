var View     = require('./view')
  , template = require('./templates/home')
  , mymap   = require('lib/mymap')
  , myfb   = require('lib/myfb')

module.exports = View.extend({
    id: 'home-view',
    template: template,

 
    render: function(){
        this.$el.html(this.template(this));
        this.afterRender();
        return this;
    },

    afterRender: function() {

    	myfb.init();
 
 
    	if(isMobile != null) {
			CDV.FB.getLoginStatus(function(response) {
				$('#facebook-login').hide();
			}, function() {
				alert('fail1');
			});   
		} 	

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
			alert('Login');
			return;
  			CDV.FB.getLoginStatus(function(response) {
    			$('#facebook-login').hide();
    		}, function() {
    			alert('fail1');
    		});

    		return;

			CDV.FB.login({
				'scope': ''
			}, function(response) {
				alert('login');
				return;
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

		this.$('#menu').transition({ x: '17em' }, 1);
		this.$('#menu').height($('html').height()); 

		this.$('#menu-button').click(function() {
			$('#menu, #menu-bg').show();
			$('#menu-bg').height($('html').height()); 
			$('#menu-bg').width($(window).width()); 
			$('#menu').transition({ x: '0' }, 500, 'ease');
		});

		this.$('#menu-bg').click(function() {
			$('#menu-bg').hide();
			$('#menu').transition({ x: '17em' }, 500, 'ease');
		});

    }
});

var picture = {
	take: function takePicture() {
		navigator.camera.getPicture(picture.onSuccess, picture.onFail, { 
			quality: 50,
		    destinationType: Camera.DestinationType.DATA_URL
		 });
	},

	onSuccess: function(imageData) {
	    var image = $('#myImage');
	    image.src = "data:image/jpeg;base64," + imageData;
	},

	onFail: function(message) {
	    alert('Failed because: ' + message);
	}	
}	