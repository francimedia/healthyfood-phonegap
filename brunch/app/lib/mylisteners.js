mylisteners = {
    init: function () {
        
        document.addEventListener("resume", function() {
        	alert('resume');
        }, false);
        
        document.addEventListener("online", function() {
        	alert('online');
        }, false);
        
        document.addEventListener("offline", function() {
        	alert('offline');
        }, false);
        
        document.addEventListener("pause", function() {
        	alert('pause');
        }, false);


    } 
};

module.exports = mylisteners

