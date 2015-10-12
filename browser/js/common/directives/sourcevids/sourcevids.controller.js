app.controller("SourceVidsCtrl", function($rootScope, $scope, VideoFactory, PreviewFactory, InstructionsFactory, $state, RandomVideoGenerator) {

    $scope.videos = [];

    var fileInput = document.getElementById("videofileinput");

    $scope.selectVideoFile = function() {
        fileInput.click();
    };

    $scope.$on("cuts-deleted", function(event, videoSourceId) {
        $scope.videos.some(function(videoElement, index) {
            if (videoElement.videoSource.id === videoSourceId) {
                $scope.videos.splice(index, 1);
                return true;
            }
        });
    });

    fileInput.addEventListener('change', function(e) {
        var filesArr = Array.prototype.slice.call(fileInput.files, 0);
        filesArr.forEach(function(file) {
            var videoElement = VideoFactory.createVideoElement(file);
            $scope.videos.push(videoElement); //try putting this up here and see if we get the spinner
            VideoFactory.addVideoSource(file)
                .then(function(videoSource) {
                    videoElement.addSource(videoSource);
                    // if it was originally a webm video, we'll want to digest
                    // if it wasn't, there will be a digest in progress, so we need to check before doing it
                    let phase = $rootScope.$$phase;
                    if (phase !== "$apply" && phase !== "$digest") $scope.$digest();
                    return VideoFactory.attachVideoSource(videoSource, videoElement.id);
                }).then(function() {
                    videoElement.sourceAttached = true;
                    videoElement.instructions.endTime = document.getElementById(videoElement.id).duration;
                    // same here as above
                    let phase = $rootScope.$$phase;
                    if (phase !== "$apply" && phase !== "$digest") $scope.$digest();
                }).then(null, function(error) {
                    //TODO show error on video tag
                    console.error("Error occured when attaching video source", error);
                });
        });

    });

    // This is here just for testing the preview player
    $scope.previewVideo = () => {
        var cutsNumber = 4;
        var cutLength = 2;
        var allInstructions = RandomVideoGenerator.createVideo($scope.videos, cutsNumber, cutLength);
        PreviewFactory.setInstructions(allInstructions);
        $state.go('preview');
    };
});
