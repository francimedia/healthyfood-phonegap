mymap = {
	
	gmap: null,
	
	userMarker: null,

	currentPosition: {
		lat: '40.739063',
		lng: '-74.005501'
	},

	init: function(mapEl) {

		var directionsService = new google.maps.DirectionsService();

		

		var mapOptions = {
			center: new google.maps.LatLng(mymap.currentPosition.lat, mymap.currentPosition.lng),
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

        mymap.gmap =  new google.maps.Map(mapEl.get(0), mapOptions);

		var onSuccess = function(position) {

			mymap.userMarker = new google.maps.Marker({
				position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
				map: mymap.gmap
			});  

			// position.coords.accuracy
			mymap.gmap.panTo(userMarker.getPosition());
 
		};

		// onError Callback receives a PositionError object
		//
		function onError(error) {
		    console.log('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');


			mymap.userMarker = new google.maps.Marker({
				position: new google.maps.LatLng(mymap.currentPosition.lat, mymap.currentPosition.lng),
				map: mymap.gmap
			});  

			// position.coords.accuracy
			mymap.gmap.panTo(userMarker.getPosition());
					    
		}

		navigator.geolocation.getCurrentPosition(onSuccess, onError);

		return mymap.gmap;

	}
}

module.exports = mymap