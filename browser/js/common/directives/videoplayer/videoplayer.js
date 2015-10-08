app.directive('videoPlayer', () => {
  return {
    restrict: 'E',
    scope: {
      instructions: '='
    },
    templateUrl: 'js/common/directives/videoplayer/videoplayer.html',
    controller: 'VideoPlayerCtrl'
  };
});

app.controller('VideoPlayerCtrl', ($scope) => {
    $scope.currentClip = 0;
    $scope.videoPlayerWidth;

    var videos;

    $scope.run = function() {

        $scope.$emit('videoPlayerLoaded');

        var timeoutId;
        var videosArrayLike = document.getElementsByTagName('video');
        var videos = [];
        for (var i = 0; i < videosArrayLike.length; i++) {
            videos[i] = videosArrayLike[i];
            videos[i].index = i;
        }

        initializeTimes();
        setVideoDimensions();

        var cumulativeTimeBefore = 0;

        for (var i = 0; i < $scope.instructions.length; i++) {
            addTimeUpdateEvents(videos[i], i);
            videos[i].timeBefore = cumulativeTimeBefore;
            cumulativeTimeBefore += $scope.instructions[i].endTime - $scope.instructions[i].startTime;
        }

        $scope.$on('newMovingTime', (event, ...args) => {
            clearTimeout(timeoutId);
            pauseCurrentVideo();
            $scope.totalCurrentTime = args[0].time;
            console.log("totalCurrentTime@ reaction in ctrl", $scope.totalCurrentTime, "args", args)
            updateVideo();
            if(!args[0].paused){
              playCurrentVideo();
            }
        })

        $scope.$on('updatedTimeRange', (event, ...args) => {
          initializeTimes();
        })

        $scope.$on('pauseButton', (event, ...args) => {
            clearTimeout(timeoutId);
            pauseCurrentVideo();
        })

        $scope.$on('playButton', (event, ...args) => {
            if($scope.totalCurrentTime >= $scope.totalEndTime){
              //video is over
              $scope.currentClip =0;
              $scope.totalCurrentTime = 0;
              videos[$scope.currentClip].currentTime = $scope.instructions[$scope.currentClip].startTime;
            }
            console.log("HIT PLAY BUTTON, current clip is", $scope.currentClip, "total current time is", $scope.totalCurrentTime);
            playCurrentVideo();
            updateVideo();
        })

        timeoutId = setTimeout(updateVideo, 10);

        function updateVideo() {
          //console.log("totalCurrentTime @ update", $scope.totalCurrentTime, "video paused", videos[$scope.currentClip].paused);
            var ended;
            if ($scope.totalCurrentTime >= $scope.totalEndTime) {
                ended=true;
                console.log("end of video");
                pauseCurrentVideo();
                return;
            }
            else {
                var foundSpot = false;
                var oldIndex = $scope.currentClip;
                var newIndex;
                for (var i = 0; i < videos.length; i++) {
                    // sets indices
                  if ($scope.totalCurrentTime < videos[i].timeBefore) {
                        newIndex = i - 1;
                        foundSpot=true;
                  }
                  else if (i === videos.length - 1) {
                        newIndex = i;
                        foundSpot=true;
                  }

                  //console.log("i", i, "timeBefore", videos[i].timeBefore, "totalCurrentTime", $scope.totalCurrentTime)
                    // evaluates whether video should change
                  if (foundSpot && oldIndex !== newIndex) {
                      //console.log("oldIndex", oldIndex, "newIndex", newIndex);
                        var clipToPlay = videos[newIndex];
                        clipToPlay.currentTime = $scope.totalCurrentTime - clipToPlay.timeBefore + $scope.instructions[newIndex].startTime;
                        if(!videos[oldIndex].paused){
                          videos[oldIndex].pause();
                          clipToPlay.play();
                        }
                        $scope.currentClip = newIndex;
                  }
                  if(foundSpot) break;
                }
                if (!ended && !videos[$scope.currentClip].paused) {
                  timeoutId = setTimeout(updateVideo, 10);
                }
            }
        }

        function addTimeUpdateEvents(video, index) {
            video.ontimeupdate = function() {
                //move the slider as video plays
                console.log("video.currentTime", this.currentTime);
                if(this.index===$scope.currentClip){
                  $scope.totalCurrentTime = video.timeBefore + video.currentTime - $scope.instructions[index].startTime;
                }
                else {
                  console.log("video", this.index, "played but it didn't affect the time");
                }
                $scope.$digest();
            };
        }

        function setVideoDimensions() {
            var maxWidth = $("#video-container").width();
            videos.forEach(video => {
                $(video).width(maxWidth);
                $(video).height(300);
            })
            $("svg").width(maxWidth)
            $scope.videoPlayerWidth = maxWidth;
        }

        function initializeTimes() {
          $scope.totalEndTime = 0;
          $scope.totalCurrentTime = 0;
          $scope.currentClip = 0;
          videos[0].currentTime = $scope.instructions[0].startTime;
          $scope.instructions.forEach(function(instruction) {
              $scope.totalEndTime += instruction.endTime - instruction.startTime;
          });
        }

        function pauseCurrentVideo() {
          videos[$scope.currentClip].pause();
          $scope.$broadcast('pauseCurrentVideo');
        }

        function playCurrentVideo() {
          videos[$scope.currentClip].play();
          $scope.$broadcast('playCurrentVideo');
        }

        playCurrentVideo();
    }
});
