(function () {

	var Game = window.Game = window.Game || {};
	
	Game.Renderer = Game.Renderer || {};
	
	 
	/**
	 * Called once per frame to update pixels.
	 * 
	 * @param {DOMHighResTimeStamp} timestamp
	 * 				 the current time requestAnimationFrame fires callback
	 */
	Game.Renderer.update = function (timestamp) {
		
		// Rendering samples
		
		var Y = Game.Renderer.height;

		while (Y--) {

			var I = Y * Game.Renderer.width;
			var X = Game.Renderer.width;

			while (X--) {

				Z = (Math.random() * 255) | 0;
				Game.Renderer.pixels[I + X] = 0x33000000 | B[Z] | G[Z] | R[Z];

			}
		}

		Game.Renderer.fill_rectangle(200, 300, 280, 380, 1, 1, 1, 1);
		Game.Renderer.fill_rectangle(250, 280, 300, 320, 1, 1, 1, 0.5);


	};
	
	// Cache of randominess for the sample updater above.
	// Math.random() is too expensive to call 3x per frame
	var R = [], G = [], B = [], Z;
	Z = 255; while (Z--) R.push((Math.random() * 255));
	Z = 255; while (Z--) G.push((Math.random() * 255) << 8);
	Z = 255; while (Z--) B.push((Math.random() * 255) << 16);
	
	
	

	/**
	 * Fast rectangle fill.
	 * 
	 * @param {number} min_x
	 * 				Left edge of rectangle
	 * @param {number} min_y
	 * 				Top edge of rectangle
	 * @param {number} max_x
	 * 				Right edge of rectangle
	 * @param {number} max_y
	 * 				Bottom edge of rectangle
	 * @param {number} r
	 * 				Amount of red fill [0,1]
	 * @param {number} g
	 * 				Amount of green fill [0,1]
	 * @param {number} b
	 * 				Amount of blue fill [0,1]
	 * @param {number} a
	 * 				Amount of alpha fill [0,1]
	 */
	Game.Renderer.fill_rectangle = function (min_x, min_y, max_x, max_y, r, g, b, a) {

		var width = Game.Renderer.width;
		var pixels = Game.Renderer.pixels;
		var Y;
		var X;
		var I;

		if (min_x < 0) min_x = 0;
		else if (min_x > width) min_x = width;
		else min_x = min_x | 0;

		if (min_y < 0) min_y = 0;
		else if (min_y > Game.Renderer.height) min_y = Game.Renderer.height;
		else min_y = min_y | 0;

		if (max_x < 0) max_x = 0;
		else if (max_x > width) max_x = width;
		else max_x = max_x | 0;

		if (max_y < 0) max_y = 0;
		else if (max_y > Game.Renderer.height) max_y = Game.Renderer.height;
		else max_y = max_y | 0;

		if (typeof a === 'undefined' || a >= 1) {

			var colour = 0xFF000000 | (b * 255) << 16 | (g * 255) << 8 | (r * 255);

			for (Y = min_y; Y < max_y; ++Y) {

				I = Y * Game.Renderer.width;

				for (X = min_x; X < max_x; ++X) {

					pixels[I + X] = colour;

				}

			}

		} else {

			var A = 1 - a;

			r = a * r * 255;
			g = a * g * 255;
			b = a * b * 255;

			for (Y = min_y; Y < max_y; ++Y) {

				I = Y * width;

				for (X = min_x; X < max_x; ++X) {

					var T = I + X;
					var c = pixels[T];
					var R = c & 0xFF;
					var G = (c >> 8) & 0xFF;
					var B = (c >> 16) & 0xFF;

					pixels[T] = 0xFF000000 | ((A * B) + B) << 16 | ((A * G) + G) << 8 | ((A * R) + R);

				}

			}

		}

	};
	

	/**
	 * Changes resolution of renderer.
	 * 
	 * @param {number} width
	 * 				Number of pixels horizontally 
	 * @param {number} height
	 * 				Number of pixels vertically
	 */
	Game.Renderer.resolution = function (width, height) {

		Game.Renderer.width = Game.Renderer.image.width = width;
		Game.Renderer.height = Game.Renderer.image.height = height;
		Game.Renderer.image_data = Game.Renderer.context.createImageData(Game.Renderer.width, Game.Renderer.height);
		Game.Renderer.pixels = new Uint32Array(Game.Renderer.image_data.data.buffer);

	};

	
	// Once off setup of the canvas, styles and main rendering loop
	if (!Game.Renderer.image) {

		Game.Renderer.image = document.createElement('canvas');
		Game.Renderer.image.style.position = 'absolute';
		Game.Renderer.image.style.top = Game.Renderer.image.style.bottom = '0';
		Game.Renderer.image.style.width = Game.Renderer.image.style.height = '100%';
		Game.Renderer.image.style.zIndex = '-1';
		document.body.appendChild(Game.Renderer.image);

		Game.Renderer.info = document.createElement('div');
		Game.Renderer.info.style.position = 'absolute';
		Game.Renderer.info.style.top = Game.Renderer.info.style.left = '0';
		Game.Renderer.info.style.background = 'white';
		document.body.appendChild(Game.Renderer.info);

		var context = Game.Renderer.context = Game.Renderer.image.getContext('2d');
		var FPS = 30;
		var InfoUpdate = 1000;

		Game.Renderer.resolution(600, 400);

		Game.Renderer.FPS = FPS;
		
		var Frame = function (timestamp) {
	
			requestAnimationFrame(Frame);
	
			++FPS;
	
			if (InfoUpdate < timestamp) {
	
				Game.Renderer.FPS = FPS;
				Game.Renderer.info.textContent = Game.Renderer.width + 'x' + Game.Renderer.height + ' (' + Game.Renderer.FPS + 'fps)';
				InfoUpdate = timestamp + 1000;
				FPS = 0;
	
			}
	
			Game.Renderer.update(timestamp);
	
			context.putImageData(Game.Renderer.image_data, 0, 0);
	
		};
		
		requestAnimationFrame(Frame);
		
		// CSS required to stretch canvas to edges without padding or scrollbars 
		Game.Renderer.style = document.createElement('style');
		Game.Renderer.style.textContent = 'html, body {margin: 0; padding: 0; overflow: hidden;}';
		document.getElementsByTagName('head')[0].appendChild(Game.Renderer.style);

	}

} ());

