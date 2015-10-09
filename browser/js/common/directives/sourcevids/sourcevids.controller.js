app.controller("SourceVidsCtrl", function ($scope, VideoFactory, PreviewFactory, InstructionsFactory, $state) {

	$scope.videos = [];

	var fileInput = document.getElementById("videofileinput");

	$scope.selectVideoFile = function () {
		fileInput.click();
	};

	$scope.$on("videosource-deleted", function (event, videoSourceId) {
		$scope.videos.some(function (videoElement, index) {
			if (videoElement.videoSource.id === videoSourceId) {
				$scope.videos.splice(index, 1);
				return true;
			}
		});
	});

	$scope.videos = [];

	var fileInput = document.getElementById("videofileinput");

	$scope.selectVideoFile = function () {
		fileInput.click();
	};

	$scope.$on("videosource-deleted", function (event, videoSourceId) {
		$scope.videos.some(function (videoElement, index) {
			if (videoElement.videoSource.id === videoSourceId) {
				$scope.videos.splice(index, 1);
				return true;
			}
		});
	});

	$scope.previewVideo = () => {
		console.log("tryina preview");
		var previewInstructions = $scope.videos.map(video => {
			var duration = document.getElementById(video.id).duration;
			console.log("when generating instructions for preview, video.duration", duration)
			return InstructionsFactory.generate(video.videoSource, duration);
		});
		PreviewFactory.setInstructions(previewInstructions);
		//then load /preview state
		$state.go('preview');
	}

	fileInput.addEventListener('change', function(e) {
		var file = fileInput.files[0],
			videoElement;
		VideoFactory.addVideoSource(file).then(function (videoSource) {
			videoElement = VideoFactory.createVideoElement(videoSource);
			$scope.videos.push(videoElement);
			$scope.$digest();
			return VideoFactory.attachVideoSource(videoSource, videoElement.id);
		}).then(function () {
			videoElement.sourceAttached = true;
			$scope.$digest();
		}).then(null, function (error) {
			//TODO show error on video tag
			console.error("Error occured when attaching video source", error);
		});
  });


});
