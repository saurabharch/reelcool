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

				var index = getVideoIndexByInstructionsId(instructions.id);
				if(index> -1){
					//clip was previously added to list
					_.assign(scope.videos[index].instructions, instructions);
				}
				else{
					//clip is not already there, add it to the end
					var updatedVideoElement = VideoFactory.createVideoElement(instructions.videoSource, instructions)
					//console.log("created new video element with instructions", updatedVideoElement.instructions);
					scope.videos.push(updatedVideoElement);

					console.log("****scope.videos BEFORE ATTACH", scope.videos);
					setTimeout(()=> {
						attachSourceToVideo(updatedVideoElement, instructions)
						//console.log("****scope.videos AFTER ATTACH", scope.videos);
					}, 0);
				}
			});

			scope.$on('unstageClip', (e, clip)=> {
				var index = getVideoIndexByInstructionsId(clip.instructions.id);
				if(index>-1){
					scope.videos.splice(index, 1);
				}
			});

			function getVideoIndexByInstructionsId (id) {
				return _.findIndex(scope.videos, (el) => {
					return el.instructions.id === id;
				});
			};

			function attachSourceToVideo(updatedVideoElement, instructions) {
				console.log('updatedVideoElement',updatedVideoElement);
				console.log('instructions',instructions);
				VideoFactory.attachVideoSource(instructions.videoSource, updatedVideoElement.id)
				.then(() =>  {
					updatedVideoElement.sourceAttached = true;
					console.log('the video element got its source');
					console.log('updatedVideoElement',updatedVideoElement);
					console.log('and instructions, apparently', updatedVideoElement.instructions);
					updatedVideoElement.instructions = instructions;
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
