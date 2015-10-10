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

		var getRandomElement = function (array) {
			if (!array.length) {
				return;
			}
			return array[Math.round(Math.random() * (array.length - 1))];
		};

		var filters = ["invert", "blur", "bw", "sepia"];

		var getRange = function (duration, cutLength) {
			var start = Math.round(Math.random() * (duration - cutLength));
			return [start, start + cutLength];
		};


		var createCuts = function (video, duration, cutsNumber) {

				var cuts = [],
				instr,
				range,
				i;

			for (i = 0; i < cutsNumber; i++) {
				instr = InstructionsFactory.generate(video.videoSource, duration);
				range = getRange(duration, 2);
				instr.startTime = range[0];
				instr.endTime = range[1];
				instr.filter = getRandomElement(filters);
				cuts.push(instr);
			}

			return cuts;

		};

		var shuffle = function (arr){
			for(var j, x, i = arr.length; i; j = Math.floor(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
			return arr;
		};


		var allInstructions = [];

		$scope.videos.forEach(video => {
			var duration = document.getElementById(video.id).duration;
			var cuts = createCuts(video, duration, 15);
			allInstructions = allInstructions.concat(cuts);
			// var instr = InstructionsFactory.generate(video.videoSource, duration);
			// instr.filter = getRandomElement(filters);
		});
		shuffle(allInstructions);
		PreviewFactory.setInstructions(allInstructions);
		//then load /preview state
		$state.go('preview');
	};




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
