app.directive("listVideo", function (VideoFactory, InstructionsFactory, $rootScope) {
	return {
		restrict: "E",
		templateUrl: "js/common/directives/list-video/list-video.html",
		scope: {
			video: "="
		},
		link: function (scope, element, attr) {

			var getVideoElement = function () {
				scope.video.element = scope.video.element ||
					document.getElementById(scope.video.id);
				return scope.video.element;
			};

			scope.sendToPlayground = function () {
				var instructions = InstructionsFactory.generate(scope.video.videoSource, getVideoElement().duration);
				$rootScope.$broadcast("changeVideo", instructions, "editor");
				console.log("instructions", instructions);
				//VideoFactory.attachVideoSource(scope.video.videoSource, "mainplayer");
			};
			scope.play = function () {
				getVideoElement().play();
			};
			scope.pause = function () {
				getVideoElement().pause();
			};

			scope.getSizeMb = function () {
				return Math.round(scope.video.videoSource.arrayBuffer.byteLength / 1024) / 1000;
			};

			scope.remove = function (videoSourceId) {
				VideoFactory.deleteVideoSource(videoSourceId);
			};

		}
	};
});
