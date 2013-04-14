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