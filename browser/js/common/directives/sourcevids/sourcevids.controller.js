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
		$scope.videos.push({
			id: videoId
		});
		$scope.$digest();
		addVideoToList(file, videoId);

    });



	var addVideoToList = function (file, videoId) {

		var mediaSource = new MediaSource();
		var video = document.querySelector('#' + videoId);
		video.src = window.URL.createObjectURL(mediaSource);
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