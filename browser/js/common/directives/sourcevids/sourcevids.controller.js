app.controller("SourceVidsCtrl", function ($scope) {

	$scope.videos = [];

	var videoIdCounter = 0;

	var fileInput = document.getElementById("videofileinput");

	// if new file selected
	// read file
	// create new MediaSource and append source
	// when done, add to list
	fileInput.addEventListener('change', function(e) {
		var file = fileInput.files[0];
		var videoId = "video_" + videoIdCounter++;
		var mediaSource = new MediaSource();
		var objUrl = window.URL.createObjectURL(mediaSource);
		var videoObj = {
			id: videoId,
			objUrl: objUrl
		};
		$scope.videos.push(videoObj);
		$scope.$digest();
		var video = document.querySelector('#' + videoId);
		video.addEventListener("seeked", function (e) {
			console.log("readystate changed:" , e);
		});
		//var video = document.querySelector('#' + videoId);
		video.src = objUrl;
		addVideoToList(file, mediaSource, videoObj);
    });


	$scope.onmain = function (arrayBuffer) {
		var mediaSource = new MediaSource();
		mediaSource.addEventListener("sourceopen", function () {
			console.log("source open");
	        var sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vorbis,vp8"');
	        console.log("???");
	        sourceBuffer.addEventListener('updateend', function(_) {
	            mediaSource.endOfStream();
	        });
	        console.log("???????????");
	        sourceBuffer.appendBuffer(arrayBuffer);
		});
		var objUrl = window.URL.createObjectURL(mediaSource);
		var video = document.getElementById('mainplayer');
		video.src = objUrl;

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