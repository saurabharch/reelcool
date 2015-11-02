app.directive("sourceaudio", function (VideoFactory, AudioFactory, AVFactory, DownloadFactory) {

	return {
		restrict: "E",
		templateUrl: "js/common/directives/sourceaudio/sourceaudio.html",
		scope: {},
		link: function (scope, element, attr) {

			scope.audioTracks = AudioFactory.getAudioElements();

			scope.showAudio = function () {
				var filtArr = scope.audioTracks.filter(el=> !el.AVsource.isTheme);
				return filtArr.length - 1; // minus the original track
			};


			var fileInput = document.getElementById("audiofileinput");


			scope.$on("videosource-deleted", function (event, audioSourceId) {
				AudioFactory.removeAudioElement(audioSourceId);
			});

			scope.selectAudioFile = function () {
				fileInput.click();
			};

			// The 'change' we're listening for is emitted when the user
			// has selected files for upload. It's emitted from the fileInput element
			// that we grabbed above on line 17.
			fileInput.addEventListener('change', function(e) {
				var filesArr = Array.prototype.slice.call(fileInput.files, 0);
				filesArr.forEach(function (file) {
					var audioElement;
					VideoFactory.addVideoSource(file).then(function (audioSource) {
						audioElement = new AVFactory.AVElement(file.name);
						audioElement.addSource(audioSource);
						AudioFactory.setAudioElement(audioElement);
						scope.$digest();
						return VideoFactory.attachVideoSource(audioSource, audioElement.id);
					}).then(function () {
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

			// This function is for audio elements that need to be on the page but 
			// are not being uploaded by the user during the current session. 
			// Instead they are being retrieved from the server. It re-uses a number
			// of functions from the VideoFactory.
			// There's a similar function in the sourcevids directive. Both of them 
			// reuse methods from VideoFactory. We might consider refactoring to 
			// avoid this repetition. 
			var putRemoteAudioOnScope = function (mediaData, isTheme) {
				var audioElement;
				VideoFactory.addRemoteSource(mediaData._id, true, isTheme).then(function (audioSource) {
					audioElement = new AVFactory.AVElement(mediaData.title);
					audioElement.addSource(audioSource);
					AudioFactory.setAudioElement(audioElement);
					scope.$digest();
					return VideoFactory.attachVideoSource(audioSource, audioElement.id);
				}).then(function () {
					// console.log("the track seems to be attached");
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
				DownloadFactory.getThemeAudio()
				.then(mediaData => {
					mediaData.forEach(data => {
						putRemoteAudioOnScope(data, true);
					});
				});
			};

			setTimeout(initThemeAudio, 500);
			setTimeout(updateSourceAudio,500);
			setInterval(updateSourceAudio,20000); // polls the server every 20 seconds


		} // link end
	};

});
