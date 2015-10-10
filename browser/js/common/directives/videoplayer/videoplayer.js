app.directive('videoPlayer', () => {
  return {
    restrict: 'E',
    scope: {
      instructions: '=',
      width: "=",
      height: "=",
      videoPlayerId: '='
    },
    templateUrl: 'js/common/directives/videoplayer/videoplayer.html',
    controller: 'VideoPlayerCtrl'
  };
});

app.controller('VideoPlayerCtrl', ($scope, VideoFactory, IdGenerator) => {
  $scope.currentClip = 0;
  $scope.instructions = $scope.instructions || [];

  $scope.videoContainerId = "video-container" + IdGenerator();

  var videos = [],
      timeoutId,
      instructionVideoMap = {};

  $scope.reInit = function() {

    if (!$scope.instructions.length) {
      return;
    }

    $scope.$emit('videoPlayerLoaded', instructionVideoMap);

      var promisedAttachments = [];
      $scope.instructions.forEach((instruction) => {
          var videoId = instructionVideoMap[instruction.id],
              promise = VideoFactory.attachVideoSource(instruction.videoSource, videoId);
          promisedAttachments.push(promise);
      });

      // Promise.all(promisedAttachments)
      // .then(()=> {
      //     $scope.$emit('videoPlayerLoaded');
      // });

    var videosArrayLike = $("#" + $scope.videoContainerId).find("video");
    console.log("$videos", videosArrayLike);
    for (var i = 0; i < videosArrayLike.length; i++) {
      videos[i] = videosArrayLike[i];
      videos[i].index = i;
    }

    initializeTimes();

    var cumulativeTimeBefore = 0;

    for (var i = 0; i < $scope.instructions.length; i++) {
      addTimeUpdateEvents(videos[i], i);
      videos[i].timeBefore = cumulativeTimeBefore;
      cumulativeTimeBefore += $scope.instructions[i].endTime - $scope.instructions[i].startTime;
    }

    timeoutId = setTimeout(updateVideo, 10);
    playCurrentVideo();

  };

  function loadVideoElements() {
    console.log("LOADING VIDEO ELEMENTS");
    setTimeout(()=> {
        $scope.reInit();
    },0);
  }

  loadVideoElements();

  var counter = 0;
  $scope.getIdForVideo = function (instructionId) {
    if (instructionVideoMap[instructionId]) {
      return instructionVideoMap[instructionId];
    }
    var newVideoId = IdGenerator();
    instructionVideoMap[instructionId] = newVideoId;
    return newVideoId;
  };


  // if($scope.instructions.length>0){
  //   setTimeout(() => {
  //     VideoFactory.attachVideoSource($scope.instructions[0].videoSource, $scope.instructions[0].id)
  //     .then(function () {
  //       $scope.reInit();
  //     });
  //   },0);
  // }
  //
  // setTimeout(() => {
  //   if($scope.instructions.length===0) return;
  //
  //   VideoFactory.attachVideoSource($scope.instructions[0].videoSource, $scope.instructions[0].id)
  //   .then(function () {
  //     $scope.reInit();
  //   });
  // },0);

  $scope.$on("changeVideo", function(e, instructions, targetVideoplayerId) {
    console.log("videoplayer got changeVideo", instructions, targetVideoplayerId, $scope.videoPlayerId);
    if($scope.videoPlayerId === targetVideoplayerId){
      $scope.instructions = instructions;
      loadVideoElements();
      // setTimeout(function() {
      //   // console.log("attached ain player with id", $scope.instructions[0].id);
      //   // VideoFactory.attachVideoSource($scope.instructions[0].videoSource, $scope.instructions[0].id)
      //   // .then(function () {
      //     $scope.reInit();
      //   // });
      // }, 0);
    }
  });

  $scope.$on('newMovingTime', (event, ...args) => {
    clearTimeout(timeoutId);
    pauseCurrentVideo();
    $scope.totalCurrentTime = args[0].time;
    console.log("totalCurrentTime@ reaction in ctrl", $scope.totalCurrentTime, "args", args)
    updateVideo();
    if (!args[0].paused) {
      playCurrentVideo();
    }
  })

  $scope.$on('updatedTimeRange', (event, ...args) => {
    initializeTimes();
  })

  $scope.$on('pauseButton', (event, ...args) => {
    console.log("pauseButton event got")
    clearTimeout(timeoutId);
    pauseCurrentVideo();
  })

  $scope.$on('playButton', (event, ...args) => {
    if ($scope.totalCurrentTime >= $scope.totalEndTime) {
      //video is over
      $scope.currentClip = 0;
      $scope.totalCurrentTime = 0;
      videos[$scope.currentClip].currentTime = $scope.instructions[$scope.currentClip].startTime;
    }
    console.log("HIT PLAY BUTTON, current clip is", $scope.currentClip, "total current time is", $scope.totalCurrentTime);
    playCurrentVideo();
    updateVideo();
  })

  function updateVideo() {
    //console.log("totalCurrentTime @ update", $scope.totalCurrentTime, "video paused", videos[$scope.currentClip].paused);
    var ended;
    if ($scope.totalCurrentTime >= $scope.totalEndTime) {
      ended = true;
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
          foundSpot = true;
        } else if (i === videos.length - 1) {
          newIndex = i;
          foundSpot = true;
        }

        // evaluates whether video should change

        if (foundSpot && (videos[$scope.currentClip].paused || newIndex!==oldIndex)) {
          //console.log("oldIndex", oldIndex, "newIndex", newIndex);
          var clipToPlay = videos[newIndex];
          clipToPlay.currentTime = $scope.totalCurrentTime - clipToPlay.timeBefore + $scope.instructions[newIndex].startTime;
          console.log("old video",oldIndex,"paused?", videos[oldIndex].paused, "newIndex", newIndex);
          if (videos[oldIndex].ended || !videos[oldIndex].paused) {
            videos[oldIndex].pause();
            clipToPlay.play();
          }
          $scope.currentClip = newIndex;
        }
        if (foundSpot) break;
      }
      if (!ended && !videos[$scope.currentClip].paused) {
        timeoutId = setTimeout(updateVideo, 10);
      }
    }
  }

  function addTimeUpdateEvents(video, index) {
    video.ontimeupdate = function() {
      //move the slider as video plays
      //console.log("video.currentTime", this.currentTime);
      if (this.index === $scope.currentClip) {
        $scope.totalCurrentTime = video.timeBefore + video.currentTime - $scope.instructions[index].startTime;
      } else {
        console.log("video", this.index, "played but it didn't affect the time");
      }
      $scope.$digest();// maybe replace by a watch for totalCurrentTime in the slider
    };
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
    console.log("pauseCurrentVideo was invoked");
    $scope.$broadcast('pauseCurrentVideo');
  }

  function playCurrentVideo() {
    videos[$scope.currentClip].play();
    $scope.$broadcast('playCurrentVideo');
  }


});
