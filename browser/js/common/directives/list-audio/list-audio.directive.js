app.directive("listAudio", function (VideoFactory, InstructionsFactory) {
	return {
		restrict: "E",
		templateUrl: "js/common/directives/list-audio/list-audio.html",
		scope: {
			audio: "="
		},
		link: function (scope, element, attr) {

			scope.getAudioDuration = function (durationInSec) {
				var min = Math.floor(durationInSec / 60);
				var sec = Math.round(durationInSec) % 60;
				return min + ":" + sec;
			};

			scope.togglePlay = function () {
				if (scope.audio.domElement.paused === true) {
					scope.audio.domElement.play();
				}else {
					scope.audio.domElement.pause();
				}
			};

			scope.remove = function (audioSourceId) {
				var delAudioMongoId = scope.audio.videoSource.mongoId;
				VideoFactory.deleteVideoSource(audioSourceId);
				var audio = InstructionsFactory.getAudio();
				if (delAudioMongoId === audio.id) {
					audio.id = null;
				}
			};

		}
	};
});
