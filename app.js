function App() {
	var canvas,
	    ctx;

	var progressBar = null;

	var modalManager = null;
	var am = null;

	var triggers = [];
	var dots = [];
	var keys = [],
		pressed = false;

	var BPM = 90;
	var channels = null;

	var clickedElem = null;

	this.init = function() {
		canvas = document.createElement('canvas');
		canvas.width = W = window.innerWidth;
		canvas.height = H = window.innerHeight;
		ctx = canvas.getContext('2d');
		document.body.appendChild(canvas);

		progressBar = $('progress');

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

		var mousePressed = false;
		window.addEventListener('mousedown', function(e) {
			if (mousePressed) return;

			if (e.target.id == 'play')
				playPause();
			else if (e.target.id == 'stop') {
				playPause();
				am.stop();
			}

			clickedElem = e.target;
			mousePressed = true;
		}, false);

		window.addEventListener('mouseup', function(e) {
			if (!mousePressed) return;

			clickedElem = null;
			mousePressed = false;
		}, false);

		window.addEventListener('keydown', function(e) {
			if (pressed) return;
			pressed = true;
			if (e.keyCode == 32) {
				playPause();
			}
		}, false);

		window.addEventListener('keyup', function(e) {
			pressed = false;
		}, false);
	
		loop();
	}
	function playPause() {
		am.playPause();
		$('play').innerHTML = !am.isPlaying ? "&#9658;" : "&#10074;&#10074;";
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
		progressBar.style.width = am.playingProgress() * 100 + '%';
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

	function $(id) {
		return document.getElementById(id);
	}
}
