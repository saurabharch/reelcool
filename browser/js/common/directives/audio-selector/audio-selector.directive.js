app.directive("audioSelector", function (AudioFactory, InstructionsFactory) {
	return {
		restrict: "E",
		templateUrl: "js/common/directives/audio-selector/audio-selector.html",
		scope: {
		},
		link: function (scope, element, attr) {
			scope.audioConf = InstructionsFactory.getAudio();
			scope.audioTracks = AudioFactory.getAudioElements();
		}
	};
});
