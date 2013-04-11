mymenu = {
	init: function(_this) { 

		_this.$('#menu').transition({ x: '18em' }, 1);
		_this.$('#menu').height($('html').height()); 

		_this.$('#menu-button').click(function() {
			mymenu.open();
		});

		_this.$('#menu-bg').click(function() {
			mymenu.close();
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

