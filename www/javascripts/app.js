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
          
          // this.bindEvents();
      
      },

      // Bind Event Listeners
      //
      // Bind any events that are required on startup. Common events are:
      // 'load', 'deviceready', 'offline', and 'online'.
      bindEvents: function() {
          document.addEventListener('deviceready', this.onDeviceReady, false);
      },
      // deviceready Event Handler
      //
      // The scope of 'this' is the event. In order to call the 'receivedEvent'
      // function, we must explicity call 'app.receivedEvent(...);'
      onDeviceReady: function() {
          app.receivedEvent('deviceready');
      },
      // Update DOM on a Received Event
      receivedEvent: function(id) {
          var parentElement = document.getElementById(id);
          var listeningElement = parentElement.querySelector('.listening');
          var receivedElement = parentElement.querySelector('.received');

          listeningElement.setAttribute('style', 'display:none;');
          receivedElement.setAttribute('style', 'display:block;');

          console.log('Received Event: ' + id);
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
window.require.register("lib/router", function(exports, require, module) {
  var application = require('application')

  module.exports = Backbone.Router.extend({
      routes: {
          '': 'home'
      },
      
      home: function() {
          $('body').html(application.homeView.render().el)
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

  module.exports = View.extend({
      id: 'home-view',
      template: template,

   
      render: function(){
          this.$el.html(this.template(this));
          this.afterRender();
          return this;
      },

      afterRender: function() {
      	FB.init({ appId: "506169639432441", nativeInterface: CDV.FB, useCachedDialogs: false });

  		var directionsService = new google.maps.DirectionsService();

  		var currentPosition = {
  			lat: '40.739063',
  			lng: '-74.005501'
  		};

  		var mapOptions = {
  			center: new google.maps.LatLng(currentPosition.lat, currentPosition.lng),
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

  		var domElement = this.$('#map-small');
          var map =  new google.maps.Map(domElement.get(0), mapOptions);
          this.map = map;

          var userMarker;

  		var onSuccess = function(position) {

  			userMarker = new google.maps.Marker({
  				position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
  				map: map
  			});  

  			// position.coords.accuracy
  			map.panTo(userMarker.getPosition());
   
  		};

  		// onError Callback receives a PositionError object
  		//
  		function onError(error) {
  		    console.log('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
  		}

  		navigator.geolocation.getCurrentPosition(onSuccess, onError);

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
    


    return "<header>\n    <h1>Healthy Food Compass</h1>\n</header> \n<div id=\"map-wrapper\">\n	<a href=\"#\" id=\"map-overlay\"></a> \n	<div id=\"map-small\"></div> \n</div>\n\n<div class=\"btn-toolbar\" style=\"padding: 20px;\">\n  <div class=\"btn-group\">\n    <button class=\"btn\" id=\"take-picture\">Take Picture</button>\n  </div>\n  <div class=\"btn-group\">\n    <button class=\"btn\">Login with Facebook</button>\n  </div>\n</div>\n\n<div id=\"myImage\"></div>\n\n<div id=\"fb-root\"></div>";
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
