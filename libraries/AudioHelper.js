function AudioHelper() {
	this.javascriptNode;
	this.audioContext;
	this.sourceBuffer;
	this.analyser;
	this.gainNode;
	this.boost;
	this.isMuted;
}

AudioHelper.prototype.setupAudioProcessing = function () {
	// Get audio context
	var AudioContextNow = window.AudioContext || window.webkitAudioContext;    
    this.audioContext = new AudioContextNow();

	this.isMuted = false;
	this.boost = 0;

	// Create JS node
	this.javascriptNode = this.audioContext.createScriptProcessor(2048, 1, 1);
	this.javascriptNode.connect(this.audioContext.destination);

	// Create Source buffer
	this.sourceBuffer = this.audioContext.createBufferSource();

	// Create analyzer node
	this.analyser = this.audioContext.createAnalyser();
	this.analyser.smoothingTimeConstant = 0.3;
	this.analyser.fftSize = 512;

	this.gainNode = this.audioContext.createGain();
	this.gainNode.gain.value = 1;

	this.sourceBuffer.connect(this.analyser);

	// Connect analyzer node
	this.analyser.connect(this.javascriptNode);
	this.analyser.connect(this.gainNode);

	// Connect gain node for volume
	this.gainNode.connect(this.audioContext.destination);
	this.gainNode.connect(this.audioContext.destination);
};

// Start audio processing
AudioHelper.prototype.start = function (buffer) {
	this.audioContext.decodeAudioData(buffer, decodeAudioDataSuccess, decodeAudioDataFailed);
	var that = this;

	function decodeAudioDataSuccess(decodedBuffer) {
		that.sourceBuffer.buffer = decodedBuffer
		that.sourceBuffer.start(0);
	}

	function decodeAudioDataFailed() {
		debugger
	}
};

AudioHelper.prototype.onAudioProcess = function(callback) {
	this.javascriptNode.onaudioprocess = callback;
}

AudioHelper.prototype.loadFile = function (filePath) {
	var url = filePath;
	return fetch(url)
	.then(response => response.arrayBuffer())
	.then(buffer => this.start(buffer));
};

AudioHelper.prototype.getFrequencyData = function() {
	// size of binCount ~ = 256
	var binCount = new Uint8Array(this.analyser.frequencyBinCount);
	// fill the binCount with data returned from getByteFrequencyData from analyser
	this.analyser.getByteFrequencyData(binCount);
	boost = 0;
	for (var i = 0; i < binCount.length; i++) {
		boost += binCount[i];
	}
	boost /= binCount.length;
	return binCount;
};
AudioHelper.prototype.getFrequencyDataFloat = function() {
	var binn = new Float32Array(this.analyser.frequencyBinCount);
	this.analyser.getFloatFrequencyData(binn);
	return binn;
}

AudioHelper.prototype.getTimeStamp = function() {
	var time = this.audioContext.currentTime;
	return time;
}

AudioHelper.prototype.getAverage = function(data) {
	var sum = 0;
	data.forEach(function(item) {
		sum += item;
	});
	return (sum / data.length);
}

AudioHelper.prototype.toggleSound = function() {
	if(!this.isMuted) {
		this.gainNode.gain.value = 0;
	} else {
		this.gainNode.gain.value = 1;
	}
	this.isMuted = !this.isMuted;
}

AudioHelper.prototype.getCentroid = function() {
	var freqPerBin = this.audioContext.sampleRate / this.analyser.fftSize;
	var sum = 0, total = 0;
	var binCount = new Uint8Array(this.analyser.frequencyBinCount);
	for(var i = 0; i < binCount.length; i++) {
		sum += freqPerBin*(i+1)*binCount[i];
		total += binCount[i];
	}
	return sum/total;
}

AudioHelper.prototype.getBass = function() {
	var freqPerBin = this.audioContext.sampleRate / this.analyser.fftSize;
	var length = 350 / freqPerBin;
	var values = 0;
	var average;
	var binCount = new Uint8Array(this.analyser.frequencyBinCount);
	for(var i = 0; i < length; i++) {
		values += binCount[i];
	}
	average = values / length;
	return average;
}

AudioHelper.prototype.getTreble = function() {
	var freqPerBin = this.audioContext.sampleRate / this.analyser.fftSize;
	var start = Math.floor(3000 / freqPerBin);
    var values = 0;
	var average;
	var binCount = new Uint8Array(this.analyser.frequencyBinCount);
    for(var i = start; i < binCount.length; i++){
		values += binCount[i];
	}
	average = values / (binCount.length - start);
	return average;
}

AudioHelper.prototype.getAmplitude = function() {
	var values = 0;
	var average;
	var binCount = new Uint8Array(this.analyser.frequencyBinCount);
	var length = binCount.length;
	for(var i = 0; i < length; i++){
		values += binCount[i];
	}
    average = values / length;
    return average;
}