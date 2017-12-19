function App() {
	var canvas,
	    ctx;

	var modalManager = null;
	var audioManager = null;

	var triggers = [];
	var dots = [];
	var keys = [],
		pressed = false;

	var BPM = 90;
	var channels = null;

	this.init = function() {
		canvas = document.createElement('canvas');
		canvas.width = W = window.innerWidth;
		canvas.height = H = window.innerHeight;
		ctx = canvas.getContext('2d');
		document.body.appendChild(canvas);

		am = new AudioManager();
		am.remember('kick', 'audios/kick2.mp3');
		am.remember('snare', 'audios/clap.mp3');
		am.remember('hat', 'audios/hat.mp3');

		am.addChannel(am.recall('kick'), '10000010000000001001001000000000');
		am.addChannel(am.recall('snare'), '00001000000010000000100000001000');
		am.addChannel(am.recall('hat'), '10101110101010101010101011101010');

		am.setBPM(95);

		channels = am.getChannels();
		console.log(channels);

		var type = ['kick', 'hihat', 'snare', 'clap'];

		for (let i = 0; i < 4; i++) {
			triggers.push({
				type: type[i],
				x: 100 + i * 100,
				y: H - 70,
				width: 50,
				height: 50
			});
		}

		window.addEventListener('keydown', function(e) {
			if (pressed) return;
			pressed = true;
			if (e.keyCode == 32) {
				dots.push({
					x: triggers[0].x + 10,
					y: 10,
					width: 30,
					height: 30
				});
			}
		}, false);

		window.addEventListener('keyup', function(e) {
			pressed = false;
		}, false);
	
		loop();
	}

	function loop() {
		update();
		render();
		window.requestAnimationFrame(loop);
	}

	var quarters = false;

	function generate() {
		
	}

	function update() {
		am.playChannel(channels);
	}
	
	function render() {
		ctx.fillStyle = "#192538";
		ctx.fillRect(0, 0, W, H);

		ctx.fillStyle = "#314A70";
		for (let i = 0; i < triggers.length; i++) {
			let t = triggers[i];
			ctx.fillRect(t.x, t.y, t.width, t.height);
		}
		for (let i = 0; i < dots.length; i++) {
			let d = dots[i];
			ctx.fillRect(d.x, d.y, d.width, d.height);
		}
	}
}
