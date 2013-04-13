myvenues = {
	
	scrollListener: function(contentEl) {

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