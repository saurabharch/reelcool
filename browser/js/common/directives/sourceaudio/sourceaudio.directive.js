app.directive("sourceaudio", function (VideoFactory, AudioFactory) {

	return {
		restrict: "E",
		templateUrl: "js/common/directives/sourceaudio/sourceaudio.html",
		scope: {},
		link: function (scope, element, attr) {

			scope.audioTracks = AudioFactory.getAudioElements();

			var fileInput = document.getElementById("audiofileinput");


			scope.$on("videosource-deleted", function (event, audioSourceId) {
				AudioFactory.removeAudioElement(audioSourceId);
				// scope.audioTracks.some(function (audioElement, index) {
				// 	if (audioElement.videoSource.id === audioSourceId) {
				// 		scope.audioTracks.splice(index, 1);
				// 		return true;
				// 	}
				// });
			});

			scope.selectAudioFile = function () {
				fileInput.click();
			};

			fileInput.addEventListener('change', function(e) {
				var filesArr = Array.prototype.slice.call(fileInput.files, 0);
				filesArr.forEach(function (file) {
					var audioElement;
					VideoFactory.addVideoSource(file).then(function (audioSource) {
						audioElement = VideoFactory.createVideoElement(file);
						audioElement.addSource(audioSource);
						AudioFactory.setAudioElement(audioElement);
						scope.$digest();
						return VideoFactory.attachVideoSource(audioSource, audioElement.id);
					}).then(function () {
						console.log("the track seems to be attached");
						var audioDomElement = document.getElementById(audioElement.id);
						audioElement.domElement = audioDomElement;
						audioElement.duration = audioDomElement.duration;
						audioElement.sourceAttached = true;
						scope.$digest();
					}).then(null, function (error) {
						//TODO show error on video tag
						console.error("Error occured when attaching video source", error);
					});
				});
			});


		}// link end
	};

});