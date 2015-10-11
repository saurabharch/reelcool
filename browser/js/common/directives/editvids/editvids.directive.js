app.directive("editvids", function (PreviewFactory, VideoFactory) {
	return {
		restrict: "E",
		$scope: {
		},
		templateUrl: "js/common/directives/editvids/editvids.html",
		controller: function ($scope, $mdDialog) {

			$scope.videos = [];
			$scope.instructions = [];

			var instructionsToVideoMap = {};
			//$scope.instructions= Pedit reel got instructions"reviewFactory.instructions;
			$scope.$on('sendClipToReel', (e,instructions) => {

				var index = getVideoIndexByInstructionsId(instructions.id);
				if(index> -1){
					//clip was previously added to list
					_.assign($scope.videos[index].instructions, instructions);
				}
				else{
					//clip is not already there, add it to the end
					var updatedVideoElement = VideoFactory.createVideoElement(instructions.videoSource, instructions);
					$scope.videos.push(updatedVideoElement);

					setTimeout(()=> {
						attachSourceToVideo(updatedVideoElement, instructions);
					}, 0);
				}
			});

			$scope.$on('unstageClip', (e, clip)=> {
				var index = getVideoIndexByInstructionsId(clip.instructions.id);
				if(index>-1){
					$scope.videos.splice(index, 1);
				}
			});

			function getVideoIndexByInstructionsId (id) {
				return _.findIndex($scope.videos, (el) => {
					return el.instructions.id === id;
				});
			};

			function attachSourceToVideo(updatedVideoElement, instructions) {
				VideoFactory.attachVideoSource(instructions.videoSource, updatedVideoElement.id)
				.then(() =>  {
					updatedVideoElement.sourceAttached = true;
					updatedVideoElement.instructions = instructions;
					if(typeof updatedVideoElement.instructions.endTime==='undefined'){
						updatedVideoElement.instructions.endTime = document.getElementById(updatedVideoElement.id).duration;
					}
					$scope.$digest();
					console.log("attached video");
				}).then(null, (error) => {
					//TODO show error on video tag
					console.error("Error occured when attaching video source", error);
				});
			}

			function updateInstructions() {
				$scope.instructions = $scope.videos.map(el => el.instructions);
			}

			$scope.showPreviewModal = ($event) => {
				updateInstructions();
				PreviewFactory.showPreview($event, $scope.instructions);
			}

		}

	};
});
