app.directive("editvids", function (PreviewFactory, VideoFactory) {
	return {
		restrict: "E",
		scope: {
		},
		templateUrl: "js/common/directives/editvids/editvids.html",
		link: function (scope, element, attr) {

			scope.videos = [];
			scope.instructions = [];

			var instructionsToVideoMap = {};
			//scope.instructions= PreviewFactory.instructions;
			scope.$on('sendClipToReel', (e,instructions) => {
				console.log("edit reel got instructions");
				//if clip is already there, modify it
				//scope.instructions[] = instructions;
				

				//if clip is not already there, add it to the end
				scope.instructions.push(instructions);
				var updatedVideoElement = VideoFactory.createVideoElement(instructions.videoSource, instructions)
				scope.videos.push(updatedVideoElement);
				setTimeout(()=> {
					addVideo(updatedVideoElement, instructions)
				}, 0);

			});

			function addVideo(updatedVideoElement, instructions) {
				VideoFactory.attachVideoSource(instructions.videoSource, updatedVideoElement.id)
				.then(() =>  {
					updatedVideoElement.sourceAttached = true;
					updatedVideoElement.instructions.endTime = document.getElementById(updatedVideoElement.id).duration;
					scope.$digest();
					console.log("attached video");
				}).then(null, (error) => {
					//TODO show error on video tag
					console.error("Error occured when attaching video source", error);
				});
			}

		}

	};
});
