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

			var putRemoteAudioOnScope = function (mongoId) {

				var audioElement;
				VideoFactory.addRemoteSource(mongoId, true).then(function (audioSource) {
					audioElement = VideoFactory.createVideoElement();
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
				VideoFactory.getPrevUploads(scope.audioTracks, true).then(function (mongoIdsToAdd) {
					mongoIdsToAdd.forEach(putRemoteAudioOnScope);
				});
				setInterval(updateSourceAudio,20000); // polls the server every 20 seconds
			};

			setTimeout(updateSourceAudio,500);


		}// link end
	};

});