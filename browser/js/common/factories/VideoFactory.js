app.factory("VideoFactory", function ($rootScope, IdGenerator, InstructionsFactory) {

	var vidFactory = {},
		videoSources = {};


	//TODO do ajax polling for uplodaed videos
	//TODO sent ajax call to delete on back-end

	var VideoElement = function (videoSource, instructions) {
		console.log("VideoElement constructor got instructions", instructions);
		this.id = IdGenerator();
		this.sourceAttached = false;
		this.videoSource = videoSource;
		this.instructions = instructions || InstructionsFactory.generate(this.videoSource);
		console.log("constructor's this", this);
	};


	var VideoSource = function (fileName, mimeType, arrayBuffer) {
		this.id = IdGenerator();
		this.fileName = fileName;
		this.mimeType = mimeType;
		this.arrayBuffer = arrayBuffer;
		this.objUrls = [];
	};


	var uploadVideoToServer = function(file){
		var reader = new FileReader();
		var formData = new FormData();
		formData.append("uploadedFile",file);

		$.ajax({
				method: 'POST',
				url: '/api/videos/upload',
				enctype:'multipart/form-data',
				data: formData,
				processData:false,
				contentType:false
			}).done(function(data){
				console.log('done!');
		});
	};


	vidFactory.createVideoElement = function (videoSource, instructions) {
		var newElement = new VideoElement(videoSource, instructions);
		console.log("created new video element", newElement);
		return newElement;
	};


	vidFactory.addVideoSource = function(file) {
		return new Promise(function (resolve, reject) {
			var reader = new FileReader();
			reader.onloadend = function() {
				var videoSrc = new VideoSource(file.name, file.type, reader.result);
				videoSources[videoSrc.id] = videoSrc;
				resolve(videoSrc);
			};
			reader.readAsArrayBuffer(file);
			uploadVideoToServer(file);
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


	vidFactory.attachVideoSource = function (videoSource, videoElementId) {
		return new Promise(function (resolve, reject) {
			var mediaSource = new MediaSource();
			mediaSource.addEventListener("sourceopen", function () {
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
			console.log("videoElementId", videoElementId);
			video.src = objUrl;
			video.reelCoolVideoSourceId = videoSource.id;
			videoSource.objUrls.push(objUrl);
		});
	};


	vidFactory.deleteVideoSource = function (videoSourceId) {
		var videoSource = videoSources[videoSourceId];

		$rootScope.$broadcast("videosource-deleted", videoSourceId);

		videoSource.objUrls.forEach(window.URL.revokeObjectURL);
		delete videoSource.arrayBuffer;

		//TODO sent ajax call to delete on back-end

		console.log("video source terminated!");
	};

	return vidFactory;

});
