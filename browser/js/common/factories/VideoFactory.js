app.factory("VideoFactory", function (IdGenerator) {

	var vidFactoy = {},
		videoSources = [];


	var VideoSource = function (fileName, mimeType, arrayBuffer) {
		this.id = IdGenerator();
		this.fileName = fileName;
		this.mimeType = mimeType;
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
				var videoSrc = new VideoSource(file.name, file.type, reader.result);
				videoSources.push(videoSrc);
				// TODO emit event about new video
				resolve(videoSrc);
			};
			reader.readAsArrayBuffer(file);
		});
	};

	var mimeTypes = {
		//'video/mp4': 'video/mp4; codecs="avc1.64001F, mp4a.40.2"',
		//'video/mp4': 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
		//'video/mp4':  'video/mp4; codecs="avc1.58A01E, mp4a.40.2"',
		//'video/mp4':  'video/mp4; codecs="avc1.4D401E, mp4a.40.2"',
		//'video/mp4':  'video/mp4; codecs="avc1.64001E, mp4a.40.2"',
		//'video/mp4':  'video/mp4; codecs="mp4v.20.8, mp4a.40.2"',
		//'video/mp4':  'video/mp4; codecs="mp4v.20.240, mp4a.40.2"',
		'video/webm': 'video/webm; codecs="vp8, vorbis"'
	};



	//TODO maybe attach info about which video elements are using a videoObj
	// and the mediasource objects
	vidFactoy.attachVideoSource = function (videoSource, videoElementId) {
		return new Promise(function (resolve, reject) {
			var mediaSource = new MediaSource();
			mediaSource.addEventListener("sourceopen", function () {
				console.log("source open");
				var sourceBuffer = mediaSource.addSourceBuffer(mimeTypes[videoSource.mimeType]);
				sourceBuffer.addEventListener('updateend', function(_) {
					try {
						mediaSource.endOfStream();
						resolve();
					} catch (error) {
						return reject(error);
					}
				});
				try {
					sourceBuffer.appendBuffer(videoSource.arrayBuffer);
				} catch (error) {
					return reject(error);
				}
			});
			var objUrl = window.URL.createObjectURL(mediaSource);
			var video = document.getElementById(videoElementId);
			video.src = objUrl;
		});
	};


	return vidFactoy;

});



