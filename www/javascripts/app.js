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
window.require.register("lib/mymenu", function(exports, require, module) {
  mymenu = {
  	init: function(_this) { 

  		_this.$('#menu').transition({ x: '18em' }, 1);
  		_this.$('#menu').height($('html').height()); 

  		_this.$('#menu-button').click(function() {
  			menu.open();
  		});

  		_this.$('#menu-bg').click(function() {
  			menu.close();
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
  		$('#menu').transition({ x: '18em' }, 500, 'ease', function() {
  			$('#menu').hide();
  		});
  	}
  };

  module.exports = mymenu

  
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
    , mymenu   = require('lib/mymenu')
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

      	connection.check();
      	
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

      	var map = mymap.init(this.$('#map-small'));

  		this.$('#map-overlay').click(function(event) {
  			$('#map-small').animate({
  				height: $(window).height() - $('header').height()
  			}, 250, 'swing', function() {
  				$('#map-overlay').hide();
  				mymap.fireResize();

  				$('header').click(function(event) {
  					$('#map-small').animate({
  						height: 200
  					}, 250, 'swing', function() {
  						$('#map-overlay').show();
  						console.log($('#map-overlay'));
  						mymap.fireResize();
  						mymap.centerUserMarker();
  					}); 
  				});    	


  			}); 
  		});    	

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
    


    return "<script src=\"http://debug.phonegap.com/target/target-script-min.js#healthyfood340598jhg\"\n	data-url=\"ttp://debug.phonegap.com/client/#healthyfood340598jhg\"\n></script>\n\n<div id=\"menu\">\n\n	<ul>\n        <li class=\"active\">\n            <a href=\"#\">\n                <strong>Home</strong>\n            </a>\n        </li>\n        <li>\n            <a href=\"#\">\n                <strong>Settings</strong>\n            </a>\n        </li>\n    </ul>\n\n</div>\n<div id=\"menu-bg\"></div>\n\n<header>\n    <h1>Healthy Food Compass</h1>\n    <button class=\"btn\" id=\"menu-button\">Menu</button>\n    <button class=\"btn\" id=\"map-close\">Close</button>\n</header> \n<div id=\"map-wrapper\">\n	<a href=\"#\" id=\"map-overlay\"></a> \n	<div id=\"map-small\"></div> \n</div>\n\n<div class=\"btn-toolbar\" style=\"padding: 20px;\">\n  <div class=\"btn-group\">\n    <button class=\"btn\" id=\"take-picture\">Take Picture</button>\n  </div>\n  <div class=\"btn-group\">\n    <button class=\"btn\" id=\"facebook-login\">Login with Facebook</button>\n  </div>\n</div>\n\n<div id=\"myImage\"></div>\n\n<div id=\"fb-root\"></div>\n";
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
