app.controller("SourceVidsCtrl", function ($scope, VideoFactory, IdGenerator) {

	$scope.videos = [];

	var VideoElement = function (videoSource) {
		this.id = IdGenerator();
		this.videoSource = videoSource;
	};

	var fileInput = document.getElementById("videofileinput");

	$scope.selectVideoFile = function () {
		fileInput.click();
	};

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
    });


	$scope.onmain = function (videoElement) {
		VideoFactory.attachVideoSource(videoElement.videoSource, "mainplayer");
	};


});


