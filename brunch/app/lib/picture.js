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