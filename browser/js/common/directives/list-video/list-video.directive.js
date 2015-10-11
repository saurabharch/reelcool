app.directive("listVideo", function (VideoFactory, InstructionsFactory, $rootScope, IdGenerator) {
	return {
		restrict: "E",
		templateUrl: "js/common/directives/list-video/list-video.html",
		scope: {
			video: "=",
			type: '='
		},
		link: function (scope, element, attr) {

			var getVideoElement = function () {
				scope.video.element = scope.video.element ||
					document.getElementById(scope.video.id);
				return scope.video.element;
			};

			scope.sendToPlayground = function () {
				//make a copy of the instructions and send it to the playground
				var instructionsCopy = {};
				_.assign(instructionsCopy, scope.video.instructions);
				if(!instructionsCopy.edited){
					instructionsCopy.id = IdGenerator();
				}
				$rootScope.$broadcast("changeVideo", [instructionsCopy], "editor");
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

			scope.removeSource = function (videoSourceId) {
				VideoFactory.deleteVideoSource(videoSourceId);
			};

			scope.unstageClip = function(video) {
				scope.$emit('unstageClip', video);
			}

		}
	};
});
