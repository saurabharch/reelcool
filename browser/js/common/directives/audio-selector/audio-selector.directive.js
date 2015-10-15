app.directive("audioSelector", function (AudioFactory, InstructionsFactory) {
	return {
		restrict: "E",
		templateUrl: "js/common/directives/audio-selector/audio-selector.html",
		scope: {
		},
		link: function (scope, element, attr) {
			scope.audioConf = InstructionsFactory.getAudio();
			scope.audioTracks = AudioFactory.getAudioElements();

			//set InstructionsFactory.audio
			scope.changeAudio = () => {
				if(scope.audioSelection.type==="upload"){
					//it's the user's own audio track
					scope.audioConf.type = "upload";
					scope.audioConf.id = scope.audioSelection.mongoId;
				}
				else if(scope.audioSelection.type==="static"){
					//it's a static audio file
					scope.audioConf.type = "static";
					scope.audioConf.staticFileName = scope.audioSelection.url;
				}
			}

			scope.$on('randomVidGenerated', (e, theme) => {
				scope.audioConf.type = "static";
				scope.audioConf.staticFileName = theme.audio;
			})
		}
	};
});
