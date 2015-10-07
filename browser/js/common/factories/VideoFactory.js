app.factory("VideoFactory", function (IdGenerator) {

	var vidFactoy = {},
		videoSources = [];


	var VideoSource = function (fileName, arrayBuffer) {
		this.id = IdGenerator();
		this.fileName = fileName;
		this.arrayBuffer = arrayBuffer;
	};

	//TODO
	// remove videos (incl. removing arrayBuffer/mediasources/ObjURLs)
	// ajax upload

	// do ajax polling for uplodaed videos
	// load new video + create VideoObject
	// and add new videos to list + send event of new videos


	vidFactoy.getVideoSources = function () {
		return videoSources;
	};


	vidFactoy.addVideoSource = function(file) {
		return new Promise(function (resolve, reject) {
			var reader = new FileReader();
			console.log(file);
			console.log("file size:", Math.round(file.size / 1000) / 1000, "MB");
			reader.onloadend = function() {
				console.log("reading file finished");
				var videoSrc = new VideoSource(file.name, reader.result);
				videoSources.push(videoSrc);
				// TODO emit event about new video
				resolve(videoSrc);
			};
			reader.readAsArrayBuffer(file);
		});
	};


	//TODO maybe attach info about which video elements are using a videoObj
	// and the mediasource objects
	vidFactoy.attachVideoSource = function (videoSource, videoElementId) {
		return new Promise(function (resolve, reject) {
			var mediaSource = new MediaSource();
			mediaSource.addEventListener("sourceopen", function () {
				console.log("source open");
				var sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vorbis,vp8"');
				sourceBuffer.addEventListener('updateend', function(_) {
					mediaSource.endOfStream();
					resolve();
				});
				sourceBuffer.appendBuffer(videoSource.arrayBuffer);
			});
			var objUrl = window.URL.createObjectURL(mediaSource);
			var video = document.getElementById(videoElementId);
			video.src = objUrl;
		});
	};


	return vidFactoy;

});