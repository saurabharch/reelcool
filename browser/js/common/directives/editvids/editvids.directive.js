app.directive("editvids", function (AVFactory, VideoFactory, InstructionsFactory, RandomVideoGenerator) {
	return {
		restrict: "E",
		scope: {},
		templateUrl: "js/common/directives/editvids/editvids.html",
		controller: function ($scope, $mdDialog, $rootScope) {

			$scope.videos = [];
			$scope.instructions = InstructionsFactory.get();
			$scope.theme = RandomVideoGenerator.getThemes()[0];

			var instructionsToVideoMap = {};

			$scope.$on('sendClipToReel', (e, instructions) => {
				addClip(instructions);
				updateInstructions($scope.videos);
			});

			function addClip (instructions) {
				console.log('adding clip', instructions);
			    var index = getVideoIndexByInstructionsId(instructions.id);
			    if (index > -1) {
			        //clip was previously added to list
			        _.assign($scope.videos[index].instructions, instructions);
			    } else {
			        //clip is not already there, add it to the end
			        var updatedVideoElement = new AVFactory.AVElement();
			        updatedVideoElement.addSource(instructions.videoSource, instructions);
			        $scope.videos.push(updatedVideoElement);

			        setTimeout(() => {
			            attachSourceToVideo(updatedVideoElement, instructions);
			        }, 0);
			    }
			}

			$scope.removeAll = function () {
				$scope.videos = [];
				$scope.instructions = [];
				InstructionsFactory.update($scope.instructions);
			};

			$scope.$on('unstageClip', (e, clip)=> {
				var index = getVideoIndexByInstructionsId(clip.instructions.id);
				if(index>-1){
					$scope.videos.splice(index, 1);
					updateInstructions($scope.videos);
				}
				console.log(InstructionsFactory.get());
			});

			function getVideoIndexByInstructionsId (id) {
				return _.findIndex($scope.videos, (el) => {
					return el.instructions.id === id;
				});
			}

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

			function updateInstructions(videosList) {
				// Updates the instructions in the InstructionsFactory
				// and puts them on the scope.
				var newInstructions = videosList.map(el => el.instructions);
				$scope.instructions = InstructionsFactory.update(newInstructions);
			}

			$scope.$on('changedTheme', (e, theme) => {
				$scope.theme = theme;
			});

			$scope.generateThemedCuts = () => {
					var cutsNumber = 3;
					var cutLength = 2;
					var randomInstructions = RandomVideoGenerator.createVideo(InstructionsFactory.getSourceVideos(), cutsNumber, cutLength, $scope.theme.filters);
					InstructionsFactory.update(randomInstructions);
					$scope.videos = [];
					$scope.instructions = InstructionsFactory.get();
					$scope.instructions.forEach(function (i) {
						addClip(i);
					});
			};

			$scope.showPreviewModal = ($event) => {
				console.log('showing preview modal, time to update instructions');
				updateInstructions($scope.videos);
				console.log('instructions are updated');
				console.log('from InstructionsFactory',InstructionsFactory.get());
				console.log('from the $scope',$scope.instructions);
				$rootScope.$broadcast('toggleModal', {show: true});
			};

		}

	};
});
