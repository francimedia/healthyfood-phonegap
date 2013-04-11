mymap = {
	
	gmap: null,
	
	userMarker: null,

	currentPosition: {
		lat: '40.739063',
		lng: '-74.005501'
	},

	mapOptions: {
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
	},

	init: function(mapEl) {
		mymap.loadGmap(mapEl);
		mymap.userLocation.get();
		return mymap.gmap;
	},

	loadGmap: function(mapEl) {
		var directionsService = new google.maps.DirectionsService();
		mymap.mapOptions.center = new google.maps.LatLng(mymap.currentPosition.lat, mymap.currentPosition.lng);
        mymap.gmap = new google.maps.Map(mapEl.get(0), mymap.mapOptions);	
	},

	userLocation: {
		
		get: function() {
			navigator.geolocation.getCurrentPosition(mymap.userLocation.onSuccess, mymap.userLocation.onError);
		},

		onSuccess: function(position) {
			mymap.addUserMarker(position.coords.latitude, position.coords.longitude, true); 
		},

		// onError Callback receives a PositionError object
		onError: function(error) {
		    console.log('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
		    // add fake position (for testing)
		    mymap.addUserMarker(mymap.currentPosition.lat, mymap.currentPosition.lng, true);
		}		
	},

	addUserMarker: function(latitude,longitude,panTo) {
		mymap.userMarker = new google.maps.Marker({
			position: new google.maps.LatLng(latitude, longitude),
			map: mymap.gmap
		});  

		// position.coords.accuracy
		if(panTo == true) {
			mymap.centerUserMarker();
		}
	},
	centerUserMarker: function() {
		if(mymap.userMarker) {
			mymap.gmap.panTo(mymap.userMarker.getPosition());
		}	
	},
	fireResize: function() {
		google.maps.event.trigger(mymap.gmap, 'resize');		
	}
}

module.exports = mymap