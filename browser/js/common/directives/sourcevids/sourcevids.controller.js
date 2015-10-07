app.controller("SourceVidsCtrl", function ($scope, VideoFactory, IdGenerator) {

	$scope.videos = [];

	var fileInput = document.getElementById("videofileinput");

	$scope.selectVideoFile = function () {
		fileInput.click();
	};

	fileInput.addEventListener('change', function(e) {
		var file = fileInput.files[0],
			videoElement;
		VideoFactory.addVideoSource(file).then(function (videoSource) {
			console.log("Video source received:", videoSource);
			videoElement = VideoFactory.createVideoElement(videoSource);
			$scope.videos.push(videoElement);
			$scope.$digest();
			return VideoFactory.attachVideoSource(videoSource, videoElement.id);
		}).then(function () {
			videoElement.sourceAttached = true;
			$scope.$digest();
			console.log("Video source attached to video element");
		}).then(null, function (error) {
			//TODO show error on video tag
			console.error("Error occured when attaching video source", error);
		});
    });


	$scope.onmain = function (videoElement) {
		VideoFactory.attachVideoSource(videoElement.videoSource, "mainplayer");
	};


});


