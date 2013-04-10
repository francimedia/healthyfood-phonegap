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
      template: template
  })
  
});
window.require.register("views/templates/home", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [2,'>= 1.0.0-rc.3'];
  helpers = helpers || Handlebars.helpers; data = data || {};
    


    return "<header>\n	<div class=\"container\">\n		<h1>Banana Pancakes</h1>\n	</div>\n</header>\n\n<div class=\"container\">\n	\n	<p class=\"lead\">Congratulations, your Brunch project is set up and very yummy. Thanks for using Banana Pancakes!</p>\n	\n	<div class=\"row\">\n		\n		<div class=\"span4\">\n			<h2>Banana Pancakes I</h2>\n			<p><a href=\"http://allrecipes.com/recipe/banana-pancakes-i/\"><img src=\"http://i.imgur.com/YlAsp.jpg\" /></a></p>\n			<blockquote>\n				<p>Crowd pleasing banana pancakes made from scratch. A fun twist on ordinary pancakes.</p>\n				<small><a href=\"http://allrecipes.com/cook/1871017/profile.aspx\">ADDEAN1</a> from <cite title=\"allrecepies.com\">allrecepies.com</cite></small>\n			</blockquote>\n			<p><a class=\"btn\" href=\"http://allrecipes.com/recipe/banana-pancakes-i/\">View Recipe &raquo;</a></p>\n		</div>\n		\n		<div class=\"span4\">\n			<h2>Banana Brown Sugar Pancakes</h2>\n			<p><a href=\"http://allrecipes.com/recipe/banana-brown-sugar-pancakes\"><img src=\"http://i.imgur.com/Yaq7Y.jpg\" /></a></p>\n			<blockquote>\n				<p>This recipe I made because I wanted to use up some instant banana oatmeal I had. I don't use syrup on it because of the sweetness from the oatmeal and brown sugar.</p>\n				<small><a href=\"http://allrecipes.com/cook/10041806/profile.aspx\">Nscoober2</a> from <cite title=\"allrecepies.com\">allrecepies.com</cite></small>\n			</blockquote>\n			<p><a class=\"btn\" href=\"http://allrecipes.com/recipe/banana-brown-sugar-pancakes\">View Recipe &raquo;</a></p>\n		</div>\n		\n		<div class=\"span4\">\n			<h2>Banana Pancakes II</h2>\n			<p><a href=\"http://allrecipes.com/recipe/banana-pancakes-ii/\"><img src=\"http://i.imgur.com/dEh09.jpg\" /></a></p>\n			<blockquote>\n				<p>These yummy pancakes are a snap to make.</p>\n				<small><a href=\"http://allrecipes.com/cook/18911/profile.aspx\">sal</a> from <cite title=\"allrecepies.com\">allrecepies.com</cite></small>\n			</blockquote>\n			<p><a class=\"btn\" href=\"http://allrecipes.com/recipe/banana-pancakes-ii/\">View Recipe &raquo;</a></p>\n		</div>\n		\n	</div>\n	\n</div>\n";
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
