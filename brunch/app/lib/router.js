var application = require('application')

module.exports = Backbone.Router.extend({
    routes: {
        '': 'home'
    },
    
    home: function() {
		if (isMobile == null) {
	        $('body').html(application.homeView.render().el)
	        return;
	    }
        document.addEventListener('deviceready', function() {
            $('body').html(application.homeView.render().el)
        }, false);
    }
})
