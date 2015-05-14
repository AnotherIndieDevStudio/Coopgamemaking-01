(function () {

	var Game = window.Game = window.Game || {};

		Game.Math = {};

		/**
		 * Returns a Unique User ID.
		 * @return {string}
		 */
		Game.Math.UUID = function () {

			// http://www.ietf.org/rfc/rfc4122.txt
			var s = [];
			var hexDigits = "0123456789abcdef";
			for (var i = 0; i < 36; i++) {
				s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
			}
			s[14] = "4";	// bits 12-15 of the time_hi_and_version field to 0010
			s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);		// bits 6-7 of the clock_seq_hi_and_reserved to 01
			s[8] = s[13] = s[18] = s[23] = "-";

			var uuid = s.join("");
			return uuid;

		};
		
		
		/**
		 * Returns val clamped within the range [min, max].
		 * 
		 * @param {number} val
		 * @param {number} min
		 * @param {number} max
		 * @return {number}
		 */
		Game.Math.clamp = function (val, min, max) {
			
			if (val < min) {
				
				return min;
				
			}
			
			if (val > max) {
				
				return max;
				
			}
			
			return val;
			
		};
		

		Game.Math.window_height = $(window).height();

		/* Grabs the window height on resize */
		$(window).resize(function(){

			Game.Math.window_height = $(window).height();

		});


} ());
