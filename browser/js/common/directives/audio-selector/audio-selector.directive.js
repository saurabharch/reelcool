app.directive("audioSelector", function (AudioFactory, InstructionsFactory) {
	return {
		restrict: "E",
		templateUrl: "js/common/directives/audio-selector/audio-selector.html",
		scope: {
		},
		link: function (scope, element, attr) {
			scope.audioConf = InstructionsFactory.getAudio();
			scope.audioTracks = AudioFactory.getAudioElements();

			scope.$on('changedTheme', (e, newTheme) => {
				//the id of the audio track id to the mongo id of the audio that has a filename
				scope.audioConf.id = scope.audioTracks.filter(track => {
					return track.fileName === newTheme.audioTitle;
				})[0].videoSource.mongoId;
			});
		}
	};
});
