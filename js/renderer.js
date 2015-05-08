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
		
		Game.Renderer.context.drawImage(Game.asset.placeholder, 390, 50, 200, 300);


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
	
			
			context.putImageData(Game.Renderer.image_data, 0, 0);
			
			Game.Renderer.update(timestamp);
			
		};
		
		requestAnimationFrame(Frame);
		
		// CSS required to stretch canvas to edges without padding or scrollbars 
		Game.Renderer.style = document.createElement('style');
		Game.Renderer.style.textContent = 'html, body {margin: 0; padding: 0; overflow: hidden;}';
		document.getElementsByTagName('head')[0].appendChild(Game.Renderer.style);

	}
	
	
	
	
	// Just pretend this wall of text isn't here. I do. It's very therapeutic.
	Game.asset = {};
	Game.asset.placeholder = new Image();
	Game.asset.placeholder.src = 'data:image/png;base64,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';
	

} ());

