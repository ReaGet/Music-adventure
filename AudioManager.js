function Sample(sample) {
	var audio = sample;

	function play() {
		audio.pause();
		audio.currentTime = 0;
		audio.play();
	}

	function stop() {
		audio.currentTime = 0;
	}

	this.play = play;
	this.stop = stop;
}

function AudioManager() {
	var audios = {};
	var total = 0;
	var current = 0;
	var BPM = 110;
	var channels = {};
	var links = {};

	function load(name, src) {
		total++;
		let audio = new Audio();
		audio.src = src;
		audio.onloadeddata = function() {
			current++;
			console.log('channel: ', name, progress());
			channels[name].samples.push(new Sample(audio));
		};
	};

	this.load = function(name, src) {
		total++;
		let audio = new Audio();
		audio.src = src;
		audio.onloadeddata = function() {
			current++;
			console.log('audio: ', name, progress());
			audios[name] = new Sample(audio);
		};
	};

	this.setBPM = function(value) {
		BPM = value;
	};

	this.getBPM = function() {
		return BPM;
	};

	this.remember = function(name, src) {
		if (links[name]) {
			console.log('This link already exists');
			return;
		}
		links[name] = src;
	}

	this.recall = function(name) {
		return links[name] ? { name: name, src: links[name] } : '';
	}

	var maxLengthBeat = 0;

	function getZeros(n) {
		let s = "";
		for (let i = 0; i < n; i++)
			s += '0';
		return s;
	}

	this.addChannel = function(data, beat) {
		if (channels[data.name]) {
			console.log('This channel already exists');
			return;
		}

		maxLengthBeat = Math.max(maxLengthBeat, beat.length);
		maxLengthBeat += maxLengthBeat % 4 > 0 ? (4 - maxLengthBeat % 4) : 0; 

		channels[data.name] = {};
		channels[data.name].beat = beat;
		channels[data.name].samples = [];
		channels[data.name].currentSample = 0;
		for (let i = 0; i < beat.length; i++) {
			if (beat[i] == 1)
				load(data.name, data.src);
		}

		for (let sample in channels) {
			let zeros = Math.abs(maxLengthBeat - channels[sample].beat.length);
			channels[sample].beat += getZeros(zeros);
		}
	};

	this.getChannel = function(name) {
		if (!channels[name]) {
			console.log('This channel doesn\'t exists');			
		}

		return channels[name];
	};

	this.getChannels = function() {
		return channels;
	};

	function progress() {
		return Math.round(current / total * 100);		
	}

	function play(name) {
		if (audios[name]) {
			audios[name].play();
		}
	};

	var currentStep = 0;
	var playOnce = false;

	function playChannel(channels) {
		if (!playOnce) {
			let timer = window.setTimeout(function() {
				for (let sample in channels) {
					let s = channels[sample];
					if (s.beat[currentStep] == 1) {
						s.samples[s.currentSample].play();
						s.currentSample++;
						s.currentSample %= s.samples.length;
					}
				}
				playOnce = false;
				currentStep++;
				currentStep %= maxLengthBeat;
				clearTimeout(timer);
			}, 60000 / BPM / 4);
			
			playOnce = true;
		}
		// if (!kick.once) {
		// 	let timer = window.setTimeout(function() {
		// 		dots.push({
		// 			x: triggers[0].x + 10,
		// 			y: 10,
		// 			width: 30,
		// 			height: 30
		// 		});
		// 		kick.once = false;
		// 		kick.current++;
		// 		kick.current %= kick.beat.length;
		// 		clearTimeout(timer);
		// 	}, kick.beat[kick.current].d);

		// 	kick.once = true;
		// }
	}

	this.update = function() {
		// play('kick');
	};


	this.playChannel = playChannel;
	this.play = play;
	this.progress = progress;
}
