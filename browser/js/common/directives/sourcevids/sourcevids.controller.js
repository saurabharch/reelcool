app.controller("SourceVidsCtrl", function ($scope, VideoFactory, IdGenerator) {

	$scope.videos = [];

	var VideoElement = function (videoSource) {
		this.id = IdGenerator();
		this.videoSource = videoSource;
	};


	//var videoIdCounter = 0;

	var fileInput = document.getElementById("videofileinput");

	fileInput.addEventListener('change', function(e) {
		var file = fileInput.files[0];
		VideoFactory.addVideoSource(file).then(function (videoSource) {
			console.log("Video source received:", videoSource);
			var videoElement = new VideoElement(videoSource);
			$scope.videos.push(videoElement);
			$scope.$digest();
			return VideoFactory.attachVideoSource(videoSource, videoElement.id);
		}).then(function () {
			console.log("Video source attached to video element");
		}).then(null, function (error) {
			console.error("Error occured when attaching video source", error);
		});
		// var videoId = "video_" + videoIdCounter++;
		// var mediaSource = new MediaSource();
		// var objUrl = window.URL.createObjectURL(mediaSource);
		// var videoObj = {
		// 	id: videoId,
		// 	objUrl: objUrl
		// };
		// $scope.videos.push(videoObj);
		// $scope.$digest();
		// var video = document.querySelector('#' + videoId);
		// video.addEventListener("seeked", function (e) {
		// 	console.log("readystate changed:" , e);
		// });
		// //var video = document.querySelector('#' + videoId);
		// video.src = objUrl;
		// addVideoToList(file, mediaSource, videoObj);
    });

	var createVideoElement = function (videoSource) {


	};



	$scope.onmain = function (videoElement) {
		VideoFactory.attachVideoSource(videoElement.videoSource, "mainplayer");
		// var mediaSource = new MediaSource();
		// mediaSource.addEventListener("sourceopen", function () {
		// 	console.log("source open");
	 //        var sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vorbis,vp8"');
	 //        console.log("???");
	 //        sourceBuffer.addEventListener('updateend', function(_) {
	 //            mediaSource.endOfStream();
	 //        });
	 //        console.log("???????????");
	 //        sourceBuffer.appendBuffer(arrayBuffer);
		// });
		// var objUrl = window.URL.createObjectURL(mediaSource);
		// var video = document.getElementById('mainplayer');
		// video.src = objUrl;

	};

	var addVideoToList = function (file, mediaSource, videoObj) {

		// var mediaSource = new MediaSource();
		// //var video = document.querySelector('#' + videoId);
		// video.src = window.URL.createObjectURL(mediaSource);
        var reader = new FileReader();
        console.log(file);
        console.log("file size:", Math.round(file.size / 1000) / 1000, "MB");
        reader.readAsArrayBuffer(file);
        reader.onloadend = function() {
            console.log("reading file finished");
            var sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vorbis,vp8"');
            sourceBuffer.addEventListener('updateend', function(_) {
                mediaSource.endOfStream();
                console.log("ended");
                console.log("size now", $scope.videos.length);
            });
            videoObj.arrayBuffer = reader.result;
            sourceBuffer.appendBuffer(reader.result);
        };


	};




	var getElementById = function (id) {
		return angular.element(document.querySelector('#' + id));
	};


	$scope.addVideo = function () {
		fileInput.click();
	};

});