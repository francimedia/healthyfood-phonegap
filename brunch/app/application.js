// Application bootstrapper.
Application = {
    initialize: function() {
        
        var HomeView = require('views/home_view')
          , Router   = require('lib/router')
        
        this.homeView = new HomeView()
        this.router   = new Router()
        
        if (typeof Object.freeze === 'function') Object.freeze(this)
        
        this.bindEvents();
    
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
        this.receivedEvent('deviceready');
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

window.onerror = function(message, url, lineNumber) {
    console.log("Error: "+message+" in "+url+" at line "+lineNumber);
}