app.directive("listVideo", function (VideoFactory, InstructionsFactory, $rootScope, IdGenerator, FilterFactory) {
	return {
		restrict: "E",
		templateUrl: "js/common/directives/list-video/list-video.html",
		scope: {
			video: "=",
			type: '='
		},
		link: function (scope, element, attr) {

			//make a string for the filter classes (if it has filters)

			var getVideoElement = function () {
				scope.video.element = scope.video.element ||
					document.getElementById(scope.video.id);
				return scope.video.element;
			};

			scope.sendToPlayground = function () {
				//make a copy of the instructions and send it to the playground
				var instructionsCopy = InstructionsFactory.makeUniqueInstructions(scope.video.instructions);
				if(!instructionsCopy.edited){
					instructionsCopy.id = IdGenerator();
				}
				console.log("inscopy", instructionsCopy);
				$rootScope.$broadcast("changeVideo", [instructionsCopy], "editor");
			};

			scope.play = function () {
				getVideoElement().play();
			};
			scope.pause = function () {
				getVideoElement().pause();
			};

			scope.getSizeMb = function () {
				// Videos don't immediately get a source, causing this function to error
				// if it doesn't have a defensive if statement.
				if (scope.video.videoSource) {
					return Math.round(scope.video.videoSource.arrayBuffer.byteLength / 1024) / 1000;
				}
				return 'NA';
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
