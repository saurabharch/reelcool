app.directive("themeSelector", function (AudioFactory, InstructionsFactory, RandomVideoGenerator, $rootScope) {
	return {
		restrict: "E",
		templateUrl: "js/common/directives/theme-selector/theme-selector.html",
		scope: {
		},
		link: function (scope, element, attr) {
			scope.audioConf = InstructionsFactory.getAudio();
			scope.audioTracks = AudioFactory.getAudioElements();
      scope.themes = RandomVideoGenerator.getThemes();

      scope.broadcastTheme = () => {
        $rootScope.$broadcast("changedTheme",scope.selectedTheme);
      }
		}
	};
});
