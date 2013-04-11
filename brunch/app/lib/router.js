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
