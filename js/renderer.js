(function () {

	var Game = window.Game = window.Game || {};
	
	var Renderer = Game.Renderer = Game.Renderer || {};
	
	
	if (!Renderer.style) {

		Renderer.style = document.createElement('style');
		Renderer.style.textContent = [
			'html, body {margin: 0; padding: 0; width: 100%; height: 100%;}',
			'* {box-sizing: border-box;}'
		].join('\n');
		document.getElementsByTagName('head')[0].appendChild(Renderer.style);

	}


	Renderer.fill_rectangle = function (min_x, min_y, max_x, max_y, r, g, b, a) {

		var width = Renderer.width;
		var pixels = Renderer.pixels;
		var Y;
		var X;
		var I;

		if (min_x < 0) min_x = 0;
		else if (min_x > width) min_x = width;
		else min_x = min_x | 0;

		if (min_y < 0) min_y = 0;
		else if (min_y > Canvas.Height) min_y = Renderer.height;
		else min_y = min_y | 0;

		if (max_x < 0) max_x = 0;
		else if (max_x > width) max_x = width;
		else max_x = max_x | 0;

		if (max_y < 0) max_y = 0;
		else if (max_y > Canvas.Height) max_y = Renderer.height;
		else max_y = max_y | 0;

		if (typeof a === 'undefined' || a >= 1) {

			var colour = 0xFF000000 | (b * 255) << 16 | (g * 255) << 8 | (r * 255);

			for (Y = min_y; Y < max_y; ++Y) {

				I = Y * Renderer.width;

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
	

	var R = [], G = [], B = [], Z;
	Z = 255; while (Z--) R.push((Math.random() * 255));
	Z = 255; while (Z--) G.push((Math.random() * 255) << 8);
	Z = 255; while (Z--) B.push((Math.random() * 255) << 16);


	// Sample Renderer.update, override with real one!
	Renderer.update = Renderer.update || function () {

		var Y = Renderer.height;

		while (Y--) {

			var I = Y * Renderer.width;
			var X = Renderer.width;

			while (X--) {

				Z = (Math.random() * 255) | 0;
				Renderer.pixels[I + X] = 0x33000000 | B[Z] | G[Z] | R[Z];

			}
		}

		Renderer.fill_rectangle(200, 300, 280, 380, 1, 1, 1, 1);
		Renderer.fill_rectangle(250, 280, 300, 320, 1, 1, 1, 0.5);


	};
	


	Renderer.resolution = function (width, height) {

		Renderer.width = Renderer.image.width = width;
		Renderer.height = Renderer.image.height = height;
		Renderer.image_data = Renderer.context.createImageData(Renderer.width, Renderer.height);
		Renderer.pixels = new Uint32Array(Renderer.image_data.data.buffer);

	};



	var AnimationFrame = function (timestamp) {

		requestAnimationFrame(AnimationFrame);

		++FPS;

		if (InfoUpdate < timestamp) {

			Renderer.FPS = FPS;
			Renderer.info.textContent = Renderer.width + 'x' + Renderer.height + ' (' + Renderer.FPS + 'fps)';
			InfoUpdate = timestamp + 1000;
			FPS = 0;

		}

		Renderer.update(timestamp);

		context.putImageData(Renderer.image_data, 0, 0);

	};


	if (!Renderer.image) {

		Renderer.image = document.createElement('canvas');
		Renderer.image.setAttribute('id', 'Canvas');
		Renderer.image.style.position = 'absolute';
		Renderer.image.style.top = Renderer.image.style.bottom = '0';
		Renderer.image.style.width = Renderer.image.style.height = '100%';
		Renderer.image.style.zIndex = '-1';
		document.body.appendChild(Renderer.image);

		Renderer.info = document.createElement('div');
		Renderer.info.setAttribute('id', 'CanvasInfo');
		Renderer.info.style.position = 'absolute';
		Renderer.info.style.bottom = Renderer.info.style.left = '0';
		Renderer.info.style.background = 'white';
		document.body.appendChild(Renderer.info);

		var context = Renderer.context = Renderer.image.getContext('2d'),
			FPS = 30,
			InfoUpdate = 1000;

		Renderer.resolution(600, 400);

		Renderer.FPS = FPS;

		requestAnimationFrame(AnimationFrame);

	}

} ());

