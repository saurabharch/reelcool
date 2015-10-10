app.controller("SourceVidsCtrl", function($scope, VideoFactory, PreviewFactory, InstructionsFactory, $state, RandomVideoGenerator) {

    $scope.videos = [];

    var fileInput = document.getElementById("videofileinput");

    $scope.selectVideoFile = function() {
        fileInput.click();
    };

    $scope.$on("videosource-deleted", function(event, videoSourceId) {
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
            var videoElement;
            VideoFactory.addVideoSource(file)
                .then(function(videoSource) {
                    videoElement = VideoFactory.createVideoElement(videoSource);
                    $scope.videos.push(videoElement);
                    $scope.$digest();
                    return VideoFactory.attachVideoSource(videoSource, videoElement.id);
                }).then(function() {
                    videoElement.sourceAttached = true;
                    $scope.$digest();
                }).then(null, function(error) {
                    //TODO show error on video tag
                    console.error("Error occured when attaching video source", error);
                });
        });

    });


    // This is here just for testing the preview player
    $scope.previewVideo = () => {
        var cutsNumber = 5;
        var cutLength = 2;
        var allInstructions = RandomVideoGenerator.createVideo($scope.videos, cutsNumber, cutLength);
        PreviewFactory.setInstructions(allInstructions);
        $state.go('preview');
    };


});
