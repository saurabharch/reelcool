app.directive('videoPlayer', () => {
  return {
    restrict: 'E',
    scope: {
      instructions: '=',
      width: "=",
      height: "=",
      videoPlayerId: '=',
      audioenabled: "="
    },
    templateUrl: 'js/common/directives/videoplayer/videoplayer.html',
    controller: 'VideoPlayerCtrl'
  };
});

app.controller('VideoPlayerCtrl', ($scope, VideoFactory, IdGenerator, AudioFactory) => {
  var videos = [],
      timeoutId,
      instructionVideoMap = {};
  $scope.currentClip = 0;
  $scope.instructions = $scope.instructions || [];
  $scope.videoContainerId = "video-container" + IdGenerator();

  if ($scope.audioenabled) {
    $scope.audioTracks = AudioFactory.getAudioElements();
    $scope.currentAudio = AudioFactory.getOriginalAudio();
  }


 //  _____       _ _   _       _ _          _   _
 // |_   _|     (_) | (_)     | (_)        | | (_)
 //   | |  _ __  _| |_ _  __ _| |_ ______ _| |_ _  ___  _ __
 //   | | | '_ \| | __| |/ _` | | |_  / _` | __| |/ _ \| '_ \
 //  _| |_| | | | | |_| | (_| | | |/ / (_| | |_| | (_) | | | |
 // |_____|_| |_|_|\__|_|\__,_|_|_/___\__,_|\__|_|\___/|_| |_|


  $scope.prepareVideoElements = function() {

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

      // TODO this is probably necessary when the player is initializing many video elements
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

    for (i = 0; i < $scope.instructions.length; i++) {
      addTimeUpdateEvents(videos[i], i);
      videos[i].timeBefore = cumulativeTimeBefore;
      cumulativeTimeBefore += $scope.instructions[i].endTime - $scope.instructions[i].startTime;
    }

    initAudio();

    timeoutId = setTimeout(updateVideo, 10);
    playCurrentVideo();

  };

  // this lets prepareVideoElements run after ng-repeat is done
  // with adding the video elements to the dom
  function init() {
    console.log("LOADING VIDEO ELEMENTS");
    setTimeout(()=> {
        $scope.prepareVideoElements();
    },0);
  }

  init();

  $scope.$on("changeVideo", function(e, instructions, targetVideoplayerId) {
    console.log("videoplayer got changeVideo", instructions, targetVideoplayerId, $scope.videoPlayerId);
    if($scope.videoPlayerId === targetVideoplayerId){
      $scope.instructions = instructions;
      init();
    }
  });

  var initAudio = function () {
    changeMute($scope.currentAudio.id !== "original_track");
    $scope.currentAudio.domElement.currentTime = 0;
  };


  function initializeTimes() {
    $scope.totalEndTime = 0;
    $scope.totalCurrentTime = 0;
    $scope.currentClip = 0;
    videos[0].currentTime = $scope.instructions[0].startTime;
    $scope.instructions.forEach(function(instruction) {
      $scope.totalEndTime += instruction.endTime - instruction.startTime;
    });
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
      $scope.$digest(); // this gets triggered very often
    };
  }

  $scope.getIdForVideo = function (instructionId) {
    if (instructionVideoMap[instructionId]) {
      return instructionVideoMap[instructionId];
    }
    var newVideoId = IdGenerator();
    instructionVideoMap[instructionId] = newVideoId;
    return newVideoId;
  };



 //  ______               _
 // |  ____|             | |
 // | |____   _____ _ __ | |_ ___
 // |  __\ \ / / _ \ '_ \| __/ __|
 // | |___\ V /  __/ | | | |_\__ \
 // |______\_/ \___|_| |_|\__|___/


  $scope.$on('newMovingTime', (event, ...args) => {
    clearTimeout(timeoutId);
    pauseCurrentVideo();
    $scope.totalCurrentTime = args[0].time;

    if ($scope.currentAudio) {
      $scope.currentAudio.domElement.currentTime = args[0].time;
    }

    //console.log("totalCurrentTime@ reaction in ctrl", $scope.totalCurrentTime, "args", args);
    updateVideo();
    if (!args[0].paused) {
      playCurrentVideo();
    }
  });

  $scope.$on('updatedTimeRange', (event, ...args) => {
    initializeTimes();
  });

  $scope.$on('pauseButton', (event, ...args) => {
    console.log("pauseButton event got")
    clearTimeout(timeoutId);
    pauseCurrentVideo();
  });

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
  });

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


  function pauseCurrentVideo() {
    console.log("current audio:", $scope.currentAudio);
    if ($scope.currentAudio) {
      $scope.currentAudio.domElement.pause();
    }
    videos[$scope.currentClip].pause();
    console.log("pauseCurrentVideo was invoked");
    $scope.$broadcast('pauseCurrentVideo');
  }

  function playCurrentVideo() {
    if ($scope.currentAudio) {
      $scope.currentAudio.domElement.play();
    }
    videos[$scope.currentClip].play();
    $scope.$broadcast('playCurrentVideo');
  }

  var changeMute = function (newState) {
    videos.forEach(function (video) {
      video.muted = newState;
    });
  };

  $scope.$watch("currentAudio", function (newValue, oldValue) {
    if (newValue === oldValue) {
      return;
    }

    if (newValue.id === "original_track") {
      changeMute(false);
    }

    if (oldValue.id === "original_track") {
      changeMute(true);
    }

    newValue.domElement.currentTime = $scope.totalCurrentTime;

    if (!videos[$scope.currentClip].paused) {
      if (oldValue) {
        oldValue.domElement.pause();
      }
      newValue.domElement.play();
    }

  });



});
