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
				google.maps.event.trigger(map, 'resize');

				$('header').click(function(event) {
					$('#map-small').animate({
						height: 200
					}, 250, 'swing', function() {
						$('#map-overlay').show();
						google.maps.event.trigger(map, 'resize');
						if(userMarker) {
							map.panTo(userMarker.getPosition());
						}
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