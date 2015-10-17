app.directive("sourceaudio", function (VideoFactory, AudioFactory) {

	return {
		restrict: "E",
		templateUrl: "js/common/directives/sourceaudio/sourceaudio.html",
		scope: {},
		link: function (scope, element, attr) {

			scope.audioTracks = AudioFactory.getAudioElements();

			scope.showAudio = function () {
				var filtArr = scope.audioTracks.filter(el=> !el.videoSource.isTheme);
				return filtArr.length - 1; // minus the original track
			};


			var fileInput = document.getElementById("audiofileinput");


			scope.$on("videosource-deleted", function (event, audioSourceId) {
				AudioFactory.removeAudioElement(audioSourceId);
			});

			scope.selectAudioFile = function () {
				fileInput.click();
			};

			fileInput.addEventListener('change', function(e) {
				var filesArr = Array.prototype.slice.call(fileInput.files, 0);
				filesArr.forEach(function (file) {
					var audioElement;
					VideoFactory.addVideoSource(file).then(function (audioSource) {
						audioElement = VideoFactory.createVideoElement(file.name);
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

			var putRemoteAudioOnScope = function (mediaData, isTheme) {
				var audioElement;
				VideoFactory.addRemoteSource(mediaData._id, true, isTheme).then(function (audioSource) {
					audioElement = VideoFactory.createVideoElement(mediaData.title);
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


			};



			var updateSourceAudio = function () {
				VideoFactory.getPrevUploads(scope.audioTracks, true).then(function (mediaData) {
					mediaData.forEach(putRemoteAudioOnScope);
				});

			};

			var initThemeAudio = () => {
				VideoFactory.getThemeAudio()
				.then(mediaData => {
					mediaData.forEach(data => {
						putRemoteAudioOnScope(data, true);
					})
				})
			}

			setTimeout(initThemeAudio, 500);
			setTimeout(updateSourceAudio,500);
			setInterval(updateSourceAudio,20000); // polls the server every 20 seconds


		}// link end
	};

});
