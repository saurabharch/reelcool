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
            videos[$scope.currentClip].pause();
            $scope.totalCurrentTime = args[0].time;
            console.log("totalCurrentTime@ reaction in ctrl", $scope.totalCurrentTime)
            updateVideo();
            if(!args[0].paused){
              videos[$scope.currentClip].play();
              $scope.$broadcast('CTRLplay');
            }
            //videos[$scope.currentClip].play();
            //console.log($scope.totalCurrentTime);
        })

        $scope.$on('updatedTimeRange', (event, ...args) => {
          initializeTimes();
        })

        $scope.$on('UIpause', (event, ...args) => {
            videos[$scope.currentClip].pause();
            clearTimeout(timeoutId);
        })

        $scope.$on('UIplay', (event, ...args) => {
            if($scope.totalCurrentTime >= $scope.totalEndTime){
              $scope.totalCurrentTime = 0;
            }
            console.log("HIT PLAY BUTTON, current clip is", $scope.currentClip, "current time is", $scope.totalCurrentTime);
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
          console.log("totalCurrentTime @ update", $scope.totalCurrentTime);
            var ended;
            if ($scope.totalCurrentTime >= $scope.totalEndTime) {
                ended=true;
                clearTimeout(timeoutId);
                console.log("end of video");
                videos[$scope.currentClip].pause();
                $scope.$broadcast('CTRLpause');
                return;
            }
            else {
                var foundSpot = false;
                var oldIndex = $scope.currentClip;
                var newIndex;
                for (var i = 0; i < videos.length; i++) {
                    // sets indices
                  if ($scope.totalCurrentTime < videos[i].timeBefore) {
                      console.log("i", i, "timeBefore", videos[i].timeBefore, "totalCurrentTime", $scope.totalCurrentTime)
                        newIndex = i - 1;
                        foundSpot=true;
                  }
                  else if (i === videos.length - 1) {
                        newIndex = i;
                        foundSpot=true;
                  }
                    // evaluates whether video should change
                  if (foundSpot && oldIndex !== newIndex) {
                      console.log("oldIndex", oldIndex, "newIndex", newIndex);
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

        function initializeTimes() {
          $scope.totalEndTime = 0;
          $scope.totalCurrentTime = 0;
          $scope.instructions.forEach(function(instruction) {
              $scope.totalEndTime += instruction.endTime - instruction.startTime;
          });
        }

        videos[0].currentTime = $scope.instructions[0].startTime;
        videos[0].play();

    }
});
