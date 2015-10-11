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
			//scope.instructions= Pedit reel got instructions"reviewFactory.instructions;
			scope.$on('sendClipToReel', (e,instructions) => {
				console.log("****scope.videos at start", scope.videos, "new instructions", instructions);
				//if clip is already there, modify it
				//scope.instructions[] = instructions;
				var index = _.findIndex(scope.instructions, (el) => {
					return el.id = instructions.id;
				});

				console.log("index found", index);
				//if clip is not already there, add it to the end
				//scope.instructions.push(instructions);
				//console.log("creating new element with", instructions.videoSource, instructions);
				var updatedVideoElement = VideoFactory.createVideoElement(instructions.videoSource, instructions)
				//console.log("created new video element with instructions", updatedVideoElement.instructions);
				scope.videos.push(updatedVideoElement);
				console.log("****scope.videos BEFORE ATTACH", scope.videos);
				setTimeout(()=> {
					attachSourceToVideo(updatedVideoElement, instructions)
					//console.log("****scope.videos AFTER ATTACH", scope.videos);
				}, 0);
			});

			function attachSourceToVideo(updatedVideoElement, instructions) {
				VideoFactory.attachVideoSource(instructions.videoSource, updatedVideoElement.id)
				.then(() =>  {
					updatedVideoElement.sourceAttached = true;
					if(typeof updatedVideoElement.instructions.endTime==='undefined'){
						updatedVideoElement.instructions.endTime = document.getElementById(updatedVideoElement.id).duration;
					}
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
