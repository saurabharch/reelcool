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

			var putRemoteAudioOnScope = function (mediaData) {
				var audioElement;
				VideoFactory.addRemoteSource(mediaData._id, true).then(function (audioSource) {
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

			var putRemoteAudioOnScopeByFileName = (staticFileName) => {
				let audioElement;
				VideoFactory.addRemoteSource(undefined, true, staticFileName)
				.then(audioSource => {
					audioElement = VideoFactory.createVideoElement(staticFileName.split('.').slice(-1));
					audioElement.addSource(audioSource);
					AudioFactory.setAudioElement(audioElement);
					scope.$digest();
					return VideoFactory.attachVideoSource(audioSource, audioElement.id);
				})
				.then( () => {
					console.log("track seems to be attached ;)");
					let audioDomElement = document.getElementById(audioElement.id);
					audioElement.domElement = audioDomElement;
					audioElement.duration = audioDomElement.duration;
					audioElement.sourceAttached = true;
					scope.$digest();
				})
				.then(null, (err) => {
					console.error("Error occured when attaching audio source", err);
				});
			}

			scope.$on('themeSelected', (e, theme) => {
				//attach the audio for the theme to the browser!
				console.log("theme was selected, we should get the audio:", theme.audio)
				putRemoteAudioOnScopeByFileName(theme.audio);
			});

			var updateSourceAudio = function () {
				console.log("UPDATESOURCEAUDIO");
				VideoFactory.getPrevUploads(scope.audioTracks, true).then(function (mediaData) {
					mediaData.forEach(putRemoteAudioOnScope);
				});

			};
			setTimeout(updateSourceAudio,500);
			setInterval(updateSourceAudio,20000); // polls the server every 20 seconds


		}// link end
	};

});
