mymapbox = {
	
	mbox: null,
	
	zoom: 11,
	userMarker: null,
	userMarkerLayer: null,
	markerLayer: null,

	currentPosition: {
        lat: 40.73269,
        lon: -73.99498
    },

    markerSymbols: {
        9: 'a',
        10: 'b',
        11: 'c',
        12: 'd',
        13: 'e',
        14: 'f',
        15: 'g',
        16: 'h',
        17: 'i',
        18: 'j',
        19: 'k',
        20: 'l'
    },

	init: function(mapEl) {
		$(function() { 
			mymapbox.loadMapbox(mapEl);
		});
		// return mymapbox.mbox;
	},

	loadMapbox: function(mapEl) { 
		$.getScript("http://api.tiles.mapbox.com/mapbox.js/v0.6.7/mapbox.js", function(data, textStatus, jqxhr) {
				mymapbox.mbox = mapbox.map(mapEl).zoom(mymapbox.zoom).center(mymapbox.currentPosition);
				mymapbox.mbox.addLayer(mapbox.layer().id('examples.map-4l7djmvo'));

				// add layer for venue markers
		        mymapbox.markerLayer = mapbox.markers.layer();
		        mymapbox.mbox.addLayer(mymapbox.markerLayer);

		        mymapbox.userLocation.get();

		});
	},

	userLocation: {
		
		get: function() {
			navigator.geolocation.getCurrentPosition(mymapbox.userLocation.onSuccess, mymapbox.userLocation.onError);
		},

		onSuccess: function(position) {
			mymapbox.currentPosition = {
		        lat: position.coords.latitude,
		        lon: position.coords.longitude
		    };
			mymapbox.addUserMarker(true); 
		},

		// onError Callback receives a PositionError object
		onError: function(error) {
		    console.log('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
		    // add fake position (for testing)
		    mymapbox.addUserMarker(true);
		}		
	},

	addUserMarker: function(panTo) {

		// remove old existing marker before adding a new one
		if(mymapbox.userMarker) {
			mymapbox.userMarker = null; // ???
		}

		mymapbox.userMarkerLayer = mapbox.markers.layer();
		mymapbox.mbox.addLayer(mymapbox.userMarkerLayer);

		mymapbox.userMarkerLayer.add_feature({
			geometry: {
			    coordinates: [
			        mymapbox.currentPosition.lon,
			        mymapbox.currentPosition.lat
			    ]
			},
			properties: {
			    'marker-size': 'small',
			    'marker-color': '#4079ff',
			    'marker-symbol': 'circle',
			}
		}); 

		// position.coords.accuracy
		if(panTo == true) {
			mymapbox.centerUserMarker();
		}
	},

	centerUserMarker: function() {
        mymapbox.mbox.zoom(13).center(mymapbox.currentPosition);
        mymapbox.getVenues(mymapbox.currentPosition);        
	},

	fireResize: function() {
		mymapbox.mbox.setSize({x: $('#map-small').width(), y: $('#map-small').height()});
	},

    getVenues: function(userLocation) {

        var url = "https://healthyfood.herokuapp.com/app/api/venues.json";
        var data = userLocation;

        var parseResponse = function (result) {
        	console.log(result);
            venuesCache = [];
            console.log(result);
            
            var features = [];
            $.each(result.response.venues, function (index, venue) {

                venuesCache[venue.id] = venue;

                var makerId = index < 9 ? index + 1 : mymapbox.markerSymbols[index];
                var markerColor = venue.save != 0 ? '#ff762c' : '#8aa924';

                features.push({
                    geometry: {
                        coordinates: [
                            venue.lon,
                            venue.lat
                        ]
                    },
                    properties: {
                        'marker-size': 'small',
                        'marker-color': markerColor,
                        'marker-symbol': makerId
                    }
                });

            });

            mymapbox.markerLayer.features(features);

        };

		$.ajax({
		  type: "GET",
		  url: url,
		  data: data,
		  dataType: 'json',
		  success: parseResponse
		});

    }

}

module.exports = mymapbox