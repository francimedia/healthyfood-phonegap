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
window.require.register("lib/myfb", function(exports, require, module) {
  myfb = {
  	init: function() {
  		if(isMobile != null) {
  			CDV.FB.init("506169639432441", 
  				function() {
  					alert('fail1');
  				}
  			);
  		} else {
  			console.log(window.FB);
  			window.FB = null;
  			console.log(window.FB);

  			  window.fbAsyncInit = function() {
  			    // init the FB JS SDK
  			    FB.init({
  			      appId      : '506169639432441',                        // App ID from the app dashboard
  			      // channelUrl : '//WWW.YOUR_DOMAIN.COM/channel.html', // Channel file for x-domain comms
  			      status     : true,                                 // Check Facebook Login status
  			      xfbml      : true                                  // Look for social plugins on the page
  			    });

  			    // Additional initialization code such as adding Event Listeners goes here
  			  };

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
window.require.register("lib/mymap", function(exports, require, module) {
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
});
window.require.register("lib/router", function(exports, require, module) {
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
window.require.register("views/home_view", function(exports, require, module) {
  var View     = require('./view')
    , template = require('./templates/home')
    , mymap   = require('lib/mymap')
    , myfb   = require('lib/myfb')

  module.exports = View.extend({
      id: 'home-view',
      template: template,

   
      render: function(){
          this.$el.html(this.template(this));
          this.afterRender();
          return this;
      },

      afterRender: function() {

      	myfb.init();
   
   
      	if(isMobile != null) {
  			CDV.FB.getLoginStatus(function(response) {
  				$('#facebook-login').hide();
  			}, function() {
  				alert('fail1');
  			});   
  		} 	

      	var map = mymap.init(this.$('#map-small'));

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
  			return;
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
});
window.require.register("views/templates/home", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [2,'>= 1.0.0-rc.3'];
  helpers = helpers || Handlebars.helpers; data = data || {};
    


    return "<header>\n    <h1>Healthy Food Compass</h1>\n</header> \n<div id=\"map-wrapper\">\n	<a href=\"#\" id=\"map-overlay\"></a> \n	<div id=\"map-small\"></div> \n</div>\n\n<div class=\"btn-toolbar\" style=\"padding: 20px;\">\n  <div class=\"btn-group\">\n    <button class=\"btn\" id=\"take-picture\">Take Picture</button>\n  </div>\n  <div class=\"btn-group\">\n    <button class=\"btn\" id=\"facebook-login\">Login with Facebook</button>\n  </div>\n</div>\n\n<div id=\"myImage\"></div>\n\n<div id=\"fb-root\"></div>";
    });
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
