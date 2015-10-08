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
    $scope.totalCurrentTime = 0;
    $scope.totalEndTime = 0;
    $scope.videoPlayerWidth;

    $scope.instructions.forEach(function(instruction) {
        $scope.totalEndTime += instruction.endTime - instruction.startTime;
    });

    var videos;

    $scope.run = function() {
        var timeoutId;
        var videosArrayLike = document.getElementsByTagName('video');
        var videos = [];
        for (var i = 0; i < videosArrayLike.length; i++) {
            videos[i] = videosArrayLike[i];
            videos[i].index = i;
        }

        setVideoDimensions();

        var cumulativeTimeBefore = 0;

        for (var i = 0; i < $scope.instructions.length; i++) {
            addTimeUpdateEvents(videos[i], i);
            videos[i].timeBefore = cumulativeTimeBefore;
            cumulativeTimeBefore += $scope.instructions[i].endTime - $scope.instructions[i].startTime;
        }

        $scope.$on('newMovingTime', (event, ...args) => {
            clearTimeout(timeoutId);
            videos[$scope.currentClip].pause();
            $scope.totalCurrentTime = args[0].time;
            updateVideo();
            if(!args[0].paused){
              videos[$scope.currentClip].play();
              $scope.$broadcast('CTRLplay');
            }
            //videos[$scope.currentClip].play();
            //console.log($scope.totalCurrentTime);
        })

        $scope.$on('UIpause', (event, ...args) => {
            videos[$scope.currentClip].pause();
            clearTimeout(timeoutId);
        })

        $scope.$on('UIplay', (event, ...args) => {
            console.log("HIT PLAY BUTTON, current clip is", $scope.currentClip);
            clearTimeout(timeoutId);
            updateVideo();
            videos[$scope.currentClip].play();
        })

        // $scope.$on('previewMovingTime', (event, ...args) => {
        //   $scope.totalCurrentTime = args[0];
        //   setCurrentPlace();
        // })

        timeoutId = setTimeout(updateVideo, 10);

        function updateVideo() {
            var ended;
            if ($scope.totalCurrentTime >= $scope.totalEndTime) {
                ended=true;
                videos[$scope.currentClip].pause();
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
                        console.log("on last video, so newIndex=",newIndex);
                  }
                    // evaluates whether video should change
                  if (foundSpot && oldIndex !== newIndex) {
                        var clipToPlay = videos[newIndex];
                        clipToPlay.currentTime = $scope.totalCurrentTime - clipToPlay.timeBefore + $scope.instructions[newIndex].startTime;
                        if(!videos[oldIndex].paused){
                          videos[oldIndex].pause();
                          clipToPlay.play();
                        }
                        $scope.currentClip = newIndex;
                  }
                  if(i===2){
                    console.log("i",i);
                  }
                  if(foundSpot) break;
                }
                if (!ended) timeoutId = setTimeout(updateVideo, 10);
            }
        }

        function addTimeUpdateEvents(video, index) {
            video.ontimeupdate = function() {
                //move the slider as video plays
                if(this.index===$scope.currentClip){
                  $scope.totalCurrentTime = video.timeBefore + video.currentTime - $scope.instructions[index].startTime;
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

        videos[0].currentTime = $scope.instructions[0].startTime;
        videos[0].play();

    }
});
