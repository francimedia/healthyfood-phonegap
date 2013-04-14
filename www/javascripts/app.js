(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.brunch = true;
})();

window.require.register("application", function(exports, require, module) {
  // Application bootstrapper.
  Application = {
      initialize: function() {
          var HomeView = require('views/home_view')
            , Router   = require('lib/router')
          
          this.homeView = new HomeView()
          this.router   = new Router()
          
          if (typeof Object.freeze === 'function') Object.freeze(this)    
      } 
  }

  module.exports = Application
   
});
window.require.register("initialize", function(exports, require, module) {
  var application = require('application')

  $(function() {
      application.initialize()
      Backbone.history.start()
  })
  
});
window.require.register("lib/connection", function(exports, require, module) {
  connection = {
      check: function () {
          
          // not working on desktop
          if(isMobile == null) {
              return;
          }

          var networkState = navigator.connection.type;

          var states = {};
          states[Connection.UNKNOWN]  = 'Unknown connection';
          states[Connection.ETHERNET] = 'Ethernet connection';
          states[Connection.WIFI]     = 'WiFi connection';
          states[Connection.CELL_2G]  = 'Cell 2G connection';
          states[Connection.CELL_3G]  = 'Cell 3G connection';
          states[Connection.CELL_4G]  = 'Cell 4G connection';
          states[Connection.CELL]     = 'Cell generic connection';
          states[Connection.NONE]     = 'No network connection';

          alert('Connection type: ' + states[networkState]);
      } 
  };

  module.exports = connection

  
});
window.require.register("lib/myfb", function(exports, require, module) {
  myfb = {
  	init: function(cb) {
  		if(isMobile != null) {
  			CDV.FB.init("506169639432441", 
  				function() {
  					alert('fail1');
  				}
  			);
  			if(cb) cb();
  		} else {
  			// unset custom FB lib
  			window.FB = null;

  			window.fbAsyncInit = function() {
  				// init the FB JS SDK
  				FB.init({
  				  appId      : '506169639432441',                        // App ID from the app dashboard
  				  // channelUrl : '//WWW.YOUR_DOMAIN.COM/channel.html', // Channel file for x-domain comms
  				  status     : true,                                 // Check Facebook Login status
  				  xfbml      : true                                  // Look for social plugins on the page
  				});

  				// Additional initialization code such as adding Event Listeners goes here
  				if(cb) cb();
  			};

  			// load original Facebook JS SDK for desktop testing
  			(function(d, s, id){
  				var js, fjs = d.getElementsByTagName(s)[0];
  				if (d.getElementById(id)) {return;}
  				js = d.createElement(s); js.id = id;
  				js.src = "https://connect.facebook.net/en_US/all.js";
  				fjs.parentNode.insertBefore(js, fjs);
  			}(document, 'script', 'facebook-jssdk'));	
  			console.log(window.FB);		
  		}	
  	}
  }


  module.exports = myfb

  
});
window.require.register("lib/mylisteners", function(exports, require, module) {
  mylisteners = {
      init: function () {
          
          document.addEventListener("resume", function() {
          	// alert('resume');
              // on resume the device should update the user locaiton 
             var mymap   = require('lib/mymap');
             mymap.userLocation.get();
          }, false);
          
          document.addEventListener("online", function() {
          	alert('online');
          }, false);
          
          document.addEventListener("offline", function() {
          	alert('offline');
          }, false);
          
          document.addEventListener("pause", function() {
              //	alert('pause');
          }, false);


      } 
  };

  module.exports = mylisteners

  
});
window.require.register("lib/mymap", function(exports, require, module) {
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
  		
  		// remove old existing marker before adding a new one
  		if(mymap.userMarker) {
  			mymap.userMarker.setMap(null);
  		}

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
});
window.require.register("lib/mymapbox", function(exports, require, module) {
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
});
window.require.register("lib/mymenu", function(exports, require, module) {
  mymenu = {
  	// update in CSS file, too :-(
  	offset: '21em',
  	init: function(_this) { 

  		_this.$('#menu').transition({ x: mymenu.offset }, 1);
  		_this.$('#menu').height($('html').height()); 

  		_this.$('#menu-button').click(function() {
  			mymenu.open();
  		});

  		_this.$('#menu-bg').click(function() {
  			mymenu.close();
  		});

  	},
  	open: function() {
  		$('#menu, #menu-bg').show();
  		$('#menu-bg').height($('html').height()); 
  		$('#menu-bg').width($(window).width()); 
  		$('#menu').transition({ x: '0' }, 500, 'ease');
  	},
  	close: function() {
  		$('#menu-bg').hide();
  		$('#menu').transition({ x: mymenu.offset }, 500, 'ease', function() {
  			$('#menu').hide();
  		});
  	}
  };

  module.exports = mymenu

  
});
window.require.register("lib/myvenues", function(exports, require, module) {
  myvenues = {

  	scrollListener: function(contentEl) {
  		
  		var mymapbox = require('lib/mymapbox'),
  		 	VenueItemView = require('views/venueitem_view'),
  		 	venuesEl = $(contentEl).find('#venue-list'),
  		 	venueListEl = $(contentEl).find('#venue-list ul');


  		var listenToMymapboxEvents = function() {

  			// add event lib
  			_.extend(mymapbox, Backbone.Events);
  			
  			// hide venue list on map fullscreen event
  			mymapbox.on("mapFullscreenOpen", function() {
  				$('#venue-list').transition({ y: $('#venue-list').height() }, 1000);
  			});					
  			
  			// Show venue list on map fullscreen event
  			mymapbox.on("mapFullscreenClose", function() {
  				$('#venue-list').transition({ y: 0 }, 1000);
  			});					
  			
  			// as soon as places are loaded, zoom and highlight the first venue
  			mymapbox.on("loadingVenues", function() {
  			  console.log("loadingVenues");
  			  setVenueListToLoadingState();
  			});					

  			mymapbox.on("loadedVenues", function() {
  			  console.log("loadedVenues");
  			  
  			  // create one list item per venue
  			  populateVenueList();

  			  // 
  			  highlightFirstVenue();

  			});					

  			// as soon as places are loaded, zoom and highlight the first venue
  			mymapbox.on("placedUserMarker", function() {
  			  // alert("placedUserMarker");
  			});					

  		};

  		var venueListOffset = null;
  		var calculateVenueListOffset = function() {
  			if (venueListOffset != null) {
  				return venueListOffset;
  			}
  			var elOffset = $(venuesEl).offset();
  			venueListOffset = $('html').height() - elOffset.top - 70;
  			return venueListOffset;
  		}

  		var setVenueListToLoadingState = function() {
  			$(venueListEl).html('<li>Loading ...</li>');
  			$(venuesEl).show();

  			// get offset from screen top
  			var elOffset = $(venuesEl).offset();
  			
  			// list should go from offset to bottom of screen
  			venueListHeight = $('html').height() - elOffset.top;

  			// 
  			venueListMoveBy = venueListHeight - 70;

  			$(venuesEl).height(venueListHeight).transition({
  				y: venueListMoveBy,
  				opacity: 0.85
  			});
  		};

  		var setVenueListToLoadedState = function() {
  			$(venuesEl).show().transition({
  				y: 0,
  				opacity: 1
  			});
  		};

  		var populateVenueList = function() {
  			console.log(mymapbox.venuesCache);

  			clearVenueList();
  			setVenueListToLoadedState();

  		    $.each(mymapbox.venuesCache, function(index, venue) {
  		    	if(venue == null) {
  		    		return;
  		    	}
          	    var item = new VenueItemView({ model: venue });
          	    // console.log('venue');
          	    // console.log(venue);
              	$(venueListEl).append(item.render().el);
          	});

          	// activeVenueListener();

  		}

  		var clearVenueList = function() {
  			$(venueListEl).html('');
  		}

  		var activeVenueListener = function() {
  			
  			var activeIndex = 0;
  			var listElements = $(venueListEl).find('li');
  			var lastColor = '';
  			var lastMarker = null;

  			var listElementHeight = 
  				$(venueListEl).find('li:first').height()
  				- ($(venueListEl).height()/(listElements.length*1.6));


  			$(venuesEl).scroll(function(eventData) {

  			  	var scrollVal = $(venuesEl).scrollTop();
  			  	var _activeIndex = Math.round((scrollVal-25)/listElementHeight);

  			  	if(_activeIndex != activeIndex) {
  			  		console.log($(listElements[activeIndex]));
  			  		$(listElements).css('background', '#fff');
  			  		$(listElements[_activeIndex]).css('background', '#ddd');
  			  		activeIndex = _activeIndex;
  			  		var venueId = $(listElements[_activeIndex]).data('id');
  			  		console.log(venueId);
  			  		var venue = mymapbox.venuesCache[venueId];
  			  		console.log(venue);
  			  		// mymapbox.center(venue.lat,venue.lon);

  			  		var featuresMapIndex = mymapbox.featuresMap[venueId];
  			  		var marker = mymapbox.features[featuresMapIndex];
  			  		console.log(marker);
  			  		
  			  		$.each(mymapbox.features, function(index, marker) {
  			  			mymapbox.features[index]['properties']['marker-color'] = marker.properties['_marker-color'];
  			  		});

  			  		mymapbox.features[featuresMapIndex]['properties']['marker-color'] = '#ff0000';

  			  		console.log(mymapbox.features[featuresMapIndex]);
  			  		mymapbox.markerLayer.features(mymapbox.features);
  			  		

  			  	}
  			});
  		}

  		var highlightFirstVenue = function(){
  			highlightVenue(0);
  		};

  		var highlightVenue = function(index){
  			//venuesCache

  			// $('')
  		};

  		// add map events
  		listenToMymapboxEvents();
  		// activeVenueListener();

  	},
  	
  	scrollListener1: function(contentEl) {

  		var mymapbox   = require('lib/mymapbox');

  		var queue = false;
  		var queues = [];


  		var offset = mymapbox.offset * -0.65; 

  		// document.getElementById('box').scrollTop
  		setTimeout(function(){
  			var scrollVal = 150;
  			$(contentEl).scrollTo(scrollVal);
  			setTimeout(function(){
  				$('#map-small').transition({ y: (scrollVal/2)-(offset*1.5)}, 100, 'ease');
  			},100);
  		},200);

  		$(contentEl).scroll(function(eventData) {


  		  var scrollVal = $(contentEl).scrollTop();

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

  	}
  }

  module.exports = myvenues
});
window.require.register("lib/picture", function(exports, require, module) {
  picture = {
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
  };

  module.exports = picture
});
window.require.register("lib/router", function(exports, require, module) {
  var application = require('application')

  module.exports = Backbone.Router.extend({
      routes: {
          '': 'home'
      },
      
      home: function() {
  		if (isMobile == null) { 
              $(function() {
  	           $('body').html(application.homeView.render().el)
              });
  	        return;
  	    }
          document.addEventListener('deviceready', function() {
              
              // assign app listeners like "resume"
              var mylisteners = require('lib/mylisteners');
              mylisteners.init();
              
              $('body').html(application.homeView.render().el)
          }, false);
      }
  })
  
});
window.require.register("lib/view_helper", function(exports, require, module) {
  // Put handlebars.js helpers here
  
});
window.require.register("models/collection", function(exports, require, module) {
  // Base class for all collections
  module.exports = Backbone.Collection.extend({
      
  })
  
});
window.require.register("models/model", function(exports, require, module) {
  // Base class for all models
  module.exports = Backbone.Model.extend({
      
  })
  
});
window.require.register("models/venueItem", function(exports, require, module) {
  // Base class for all models
  module.exports = Backbone.Model.extend({
      initialize: function(){
          // console.log("Welcome to this world");
      }
      
  })
});
window.require.register("views/home_view", function(exports, require, module) {
  var View     = require('./view')
    , template = require('./templates/home')
    // , mymap   = require('lib/mymap')
    , mymapbox   = require('lib/mymapbox')
    , myfb   = require('lib/myfb')
    , mymenu   = require('lib/mymenu')
    , myvenues   = require('lib/myvenues')
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

      	this.$('#content').height(window.height - $('header').height());

      	// scrollListener v1
      	// myvenues.scrollListener1(this.$('#content'));

      	// scrollListener v2
      	myvenues.scrollListener(this.$('#content'));

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

  		
  		// this.$('#venue-list').height($(window).height() - $('header').height() - 200);



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
  
});
window.require.register("views/templates/home", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [2,'>= 1.0.0-rc.3'];
  helpers = helpers || Handlebars.helpers; data = data || {};
    


    return "<script src='http://api.tiles.mapbox.com/mapbox.js/v0.6.7/mapbox.js'></script>\n<div id=\"menu\">\n    <div id=\"menu-header\"><h1>Menu</h1></div>\n	<ul id=\"menu-items\">\n        <li class=\"active\">\n            <a href=\"#\">\n                <strong>Home</strong>\n            </a>\n        </li>\n        <li>\n            <a href=\"#\">\n                <strong>Settings</strong>\n            </a>\n        </li>\n    </ul>\n\n</div>\n<div id=\"menu-bg\"></div>\n\n<header>\n    <img src=\"./images/header-icon.png\" alt=\"\" id=\"logo\" alt=\"Healthy Food Compass\" /> \n    <img src=\"./images/menu.png\" alt=\"\" id=\"menu-button\" /> \n    <button class=\"btn\" id=\"map-close\">Close</button>\n</header> \n<div id=\"content\">\n    <div id=\"map-wrapper\">\n    	<a href=\"#\" id=\"map-overlay\"></a> \n    	<div id=\"map-small\"></div> \n        <div id=\"venue-list\">\n            <ul>\n                \n            </ul>\n\n        </div> \n    </div>\n\n    <div class=\"btn-toolbar\" style=\"display: none; padding: 20px;\">\n      <div class=\"btn-group\">\n        <button class=\"btn\" id=\"take-picture\">Take Picture</button>\n      </div>\n      <div class=\"btn-group\">\n        <button class=\"btn\" id=\"facebook-login\">Login with Facebook</button>\n      </div>\n    </div>\n\n    <div id=\"myImage\"></div>\n\n    <div id=\"fb-root\"></div>\n</div>";
    });
});
window.require.register("views/templates/venueitem", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [2,'>= 1.0.0-rc.3'];
  helpers = helpers || Handlebars.helpers; data = data || {};
    var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


    buffer += "<div id=\""
      + escapeExpression(((stack1 = ((stack1 = depth0.model),stack1 == null || stack1 === false ? stack1 : stack1.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
      + "\">"
      + escapeExpression(((stack1 = ((stack1 = depth0.model),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
      + "</div>";
    return buffer;
    });
});
window.require.register("views/venueitem_view", function(exports, require, module) {
  var View     = require('./view')
    , template = require('./templates/venueitem')
    , VenueItemModel = require('../models/venueItem')

  module.exports = View.extend({
      id: '', 
      tagName: 'li',
      template: template,

      initialize: function() {
          this.model = new VenueItemModel(this.options.model);
      },

      render: function(){
          this.id = this.options.model.id;
          this.$el.attr('data-id', this.id);
          // this.$el.html(this.options.model.name)
          this.$el.html(this.template(this.options))
          this.afterRender()
          return this

      }

  })
  
});
window.require.register("views/view", function(exports, require, module) {
  require('lib/view_helper')

  // Base class for all views
  module.exports = Backbone.View.extend({
      
      initialize: function(){
          this.render = _.bind(this.render, this)
      },
      
      template: function(){},
      getRenderData: function(){},
      
      render: function(){
          this.$el.html(this.template(this.getRenderData()))
          this.afterRender()
          return this
      },
      
      afterRender: function(){}
      
  })
  
});
