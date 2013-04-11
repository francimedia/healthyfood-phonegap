var View     = require('./view')
  , template = require('./templates/home')

module.exports = View.extend({
    id: 'home-view',
    template: template,

 
    render: function(){
        this.$el.html(this.template(this));
        this.afterRender();
        return this;
    },

    afterRender: function() {

    	document.addEventListener("deviceready", function() {
    		// FB.init({ appId: "506169639432441", nativeInterface: CDV.FB, useCachedDialogs: false });
    		CDV.FB.init("506169639432441", function() {
					CDV.FB.getLoginStatus(function(response) {
		    			$('#facebook-login').hide();
		    		}, function() {
		    			alert('fail1');
		    		});
				},
    			function() {
    				alert('fail1');
    			}
    		);

    	}, false);

		var directionsService = new google.maps.DirectionsService();

		var currentPosition = {
			lat: '40.739063',
			lng: '-74.005501'
		};

		var mapOptions = {
			center: new google.maps.LatLng(currentPosition.lat, currentPosition.lng),
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			mapTypeControl: false,
			mapTypeControl: false,
			overviewMapControl: false,
			panControl: false,
			zoomControl: false,
			scaleControl: false,
			streetViewControl: false,
			zoom: 14,
			styles: [
			{
			  "stylers": [
			    { "saturation": -69 },
			    { "visibility": "simplified" }
			  ]
			}
			]
		}

		var domElement = this.$('#map-small');
        var map =  new google.maps.Map(domElement.get(0), mapOptions);
        this.map = map;

        var userMarker;

		var onSuccess = function(position) {

			userMarker = new google.maps.Marker({
				position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
				map: map
			});  

			// position.coords.accuracy
			map.panTo(userMarker.getPosition());
 
		};

		// onError Callback receives a PositionError object
		//
		function onError(error) {
		    console.log('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
		}

		navigator.geolocation.getCurrentPosition(onSuccess, onError);

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