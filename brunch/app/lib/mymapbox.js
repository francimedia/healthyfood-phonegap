// this should/could be reorganized as a view (?)

var myvenues   = require('lib/myvenues');

mymapbox = {
	
	mbox: null,

	venuesCache: [],
	
	userMarker: null,
	userMarkerLayer: null,
	markerLayer: null,
	offset: 0,
	features: [],
	featuresMap: [],

	currentPosition: {
        lat: 40.73269,
        lon: -73.99498
    },

    mapSize: {
    	'small': {
    		y: 200
    	}
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

		_.extend(mymapbox, Backbone.Events);

		$(function() { 
			mymapbox.loadMapbox(mapEl);
		});

	},

	loadMapbox: function(mapEl) { 
		$.getScript("http://api.tiles.mapbox.com/mapbox.js/v0.6.7/mapbox.js", function(data, textStatus, jqxhr) {

			mymapbox.mbox = mapbox.map(mapEl).zoom(mymapbox.getZoom('overview')).center(mymapbox.currentPosition);

			var retina = window.devicePixelRatio >= 2;
			if (retina) {
			    // Retina tiles are sized 1/2 of normal tiles for twice the pixel density
			    mymapbox.mbox.tileSize = { x: 128, y: 128 };
			}

			mymapbox.mbox.addLayer(mapbox.layer().id('examples.map-4l7djmvo'));

			// add layer for venue markers
	        mymapbox.markerLayer = mapbox.markers.layer();
	        mymapbox.mbox.addLayer(mymapbox.markerLayer);

	        mymapbox.userLocation.get();
	        // mymapbox.setMapSizeSmall(0);
	        mymapbox.setMapSizeInit();
	        mymapbox.eventListeners();

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

		// fireEvent("venuesLoaded", document);
		mymapbox.trigger("placedUserMarker");
  		
	},

	// figure out the perfect zoom level for the current situation
	getZoom: function(type) {
		switch(type) {
			case 'overview':
				return 13;
				break;
			case 'nearbyZoom':
				return 15;
				break;
			case 'nearby':
				return 13;
				break;
			default:
				return 14;
				break;
		}
	},

	centerUserMarker: function() {
        // mymapbox.mbox.zoom(mymapbox.getZoom('nearby')).center(mymapbox.currentPosition);
        mymapbox.mbox.ease.location({ lat: mymapbox.currentPosition.lat, lon: mymapbox.currentPosition.lon }).zoom(14).optimal();

        mymapbox.getVenues(mymapbox.currentPosition);        
	},

	center: function(lat,lon) {
		// mymapbox.mbox.center({ lat: lat, lon: lon }, true);
		mymapbox.mbox.ease.location({ lat: lat, lon: lon }).optimal();
	},

	fireResize: function() {
		mymapbox.mbox.setSize({x: $('#map-small').width(), y: $('#map-small').height()});
	},

	_location: null,
	setMapSizeInit: function() {
		$('#map-small').height($('html').height());
		// alert(($('#map-small').height()-50)/2);
		// var location = mymapbox.mbox.pointLocation({ x: $('#map-small').width()/2, y: ($('#map-small').height()-50)/2 });
		var location = mymapbox.mbox.pointLocation({ x: $('#map-small').width()/2, y: 30 });
		mymapbox.mbox.ease.location({ lat: location.lat, lon: location.lon }).zoom(14).optimal();
	},

	setMapSizeSmall: function(time) {
		var location = mymapbox.mbox.pointLocation({ x: $('#map-small').width()/2, y: $('#map-small').height()*2.1});
		mymapbox.mbox.ease.location({ lat: location.lat, lon: location.lon }).zoom(14).optimal(2);
		// mymapbox.mbox.ease.zoom(12).optimal();
		return;
		var location = mymapbox.mbox.pointLocation({ x: $('#map-small').width()/2, y: -180});
		mymapbox.mbox.ease.location({ lat: location.lat, lon: location.lon }).zoom(14).optimal();
		return;

		mymapbox.mbox.ease.zoom(12).optimal();
		return;

		$('#map-small').height($('html').height());

		console.log('location');
		console.log(mymapbox.mbox);
		var location = mymapbox.mbox.pointLocation({ x: $('#map-small').width()/2, y: 180});
		console.log(location);
		mymapbox.mbox.ease.location({ lat: location.lat, lon: location.lon }).zoom(14).optimal();

		return;

		// pointCoordinate

		$('#map-small').height( 2 * $('html').height());
		mymapbox.fireResize();

		// mymapbox.mbox.ease.location({ lat: mymapbox.currentPosition.lat, lon: mymapbox.currentPosition.lon }).zoom(14).optimal();

		$('#map-small').transition({ 
			y: (-1 * $('html').height()) + 95
		}, time, 'ease'); 
	},

	setMapSizeLarge: function() {
		// mymapbox.mbox.setSize({x: $('#map-small').width(), y: $('#map-small').height()});
		mymapbox.mbox.ease.location({ lat: mymapbox.currentPosition.lat, lon: mymapbox.currentPosition.lon }).zoom(16).optimal(2);
		return;
		// mymapbox.mbox.ease.location({ lat: mymapbox.currentPosition.lat, lon: mymapbox.currentPosition.lon }).zoom(15).optimal(0.9, 1.42, function() {

$('#map-small').transition({ 
				y: (-0.66666 * $('html').height()) + 95
			}, 100, 'ease', function() {

			});

			mymapbox.mbox.ease.zoom(15).optimal(0.9, 1.42, function() {
			$('#map-small').transition({ 
				y: (-0.66666 * $('html').height()) + 95
			}, 250, 'ease', function() {

			});
		}); 		
	},

    getVenues: function(userLocation) {

        var url = "https://healthyfood.herokuapp.com/app/api/venues.json";
        var data = userLocation;

        var parseResponse = function (result) {
			var venues = result.response.venues;
			mymapbox.cacheVenueResults(venues);
			mymapbox.addMarkersToMap(venues);
			mymapbox.calculateMapExtend(venues);
			mymapbox.trigger("loadedVenues");
        };

		mymapbox.trigger("loadingVenues");

		$.ajax({
		  type: "GET",
		  url: url,
		  data: data,
		  dataType: 'json',
		  success: parseResponse
		});

    },

    addMarkersToMap: function(venues) {

        mymapbox.features = [];
        mymapbox.featuresMap = [];

        $.each(venues, function (index, venue) {

            var makerId = index < 9 ? index + 1 : mymapbox.markerSymbols[index];
            var markerColor = venue.save != 0 ? '#ff762c' : '#8aa924';

            mymapbox.features.push({
                geometry: {
                    coordinates: [
                        venue.lon,
                        venue.lat
                    ]
                },
                properties: {
                    'marker-size': 'small',
                    'marker-color': markerColor,
                    '_marker-color': markerColor,
                    'marker-symbol': makerId
                }
            });

            mymapbox.featuresMap[venue.id] = mymapbox.features.length - 1;
            
        });

        mymapbox.markerLayer.features(mymapbox.features);

    },

    cacheVenueResults: function(venues) {
    	// localStorage.setItem("venues", result);
    	mymapbox.venuesCache = [];
        $.each(venues, function (index, venue) {
            mymapbox.venuesCache[venue.id] = venue;
        });
    },

    calculateMapExtend: function(venues) {
    	return;
    	var lat = [];
    	var lon = [];
        $.each(venues, function (index, venue) {
            lat.push(venue.lat);
            lon.push(venue.lon);
        });

        lat.sort();
        lon.sort();

        console.log(lat);

        console.log(lon);

        // console.log({lat: lat[0], lon: Math.min(lon) }, { lat: Math.max(lat), lon: Math.max(lon) });
		mymapbox.mbox.setExtent([
			{ lat: lat[0], lon: lon[0] }, 
			{ lat: lat[(lat.length-1)], lon: lon[(lon.length-1)] }
		]);

		mymapbox.mbox.zoomBy(-1);
    },

    eventListeners: function() {

		$('#map-overlay').click(function(event) {
			mymapbox.trigger("mapFullscreenOpen");
		});

		mymapbox.on("mapFullscreenOpen", function() {
			$('#map-overlay').hide();
			mymapbox.setMapSizeLarge();
			// mymapbox.mbox.zoomBy(1, true); 
		});					


		$('header').click(function(event) {
			if($('#map-overlay').css('display') == 'block') {
				return;
			}

			mymapbox.trigger("mapFullscreenClose");
//			$('#venue-list').transition({ y: 0 }, 600, function() {
// 				mymapbox.setMapSizeSmall();
// 				mymapbox.centerUserMarker();
// 			});
		});

		mymapbox.on("mapFullscreenClose", function() {
			$('#map-overlay').show();
			mymapbox.setMapSizeSmall(1000); 
			// mymapbox.mbox.zoomBy(-1, true);
		});					


    }

}

module.exports = mymapbox