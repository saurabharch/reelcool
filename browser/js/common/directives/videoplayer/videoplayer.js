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

app.controller('VideoPlayerCtrl', ($scope, VideoFactory, IdGenerator, AudioFactory, InstructionsFactory) => {
  var videos = [],
      timeoutId,
      instructionVideoMap = {};

 //  _____       _ _   _       _ _          _   _
 // |_   _|     (_) | (_)     | (_)        | | (_)
 //   | |  _ __  _| |_ _  __ _| |_ ______ _| |_ _  ___  _ __
 //   | | | '_ \| | __| |/ _` | | |_  / _` | __| |/ _ \| '_ \
 //  _| |_| | | | | |_| | (_| | | |/ / (_| | |_| | (_) | | | |
 // |_____|_| |_|_|\__|_|\__,_|_|_/___\__,_|\__|_|\___/|_| |_|

  $scope.currentClip = 0;
  $scope.instructions = $scope.instructions || [];
  $scope.videoContainerId = "video-container" + IdGenerator();

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

    if ($scope.audioenabled) {
      initAudio();
    }

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
    // console.log("videoplayer got changeVideo", instructions, targetVideoplayerId, $scope.videoPlayerId);
    if($scope.videoPlayerId === targetVideoplayerId){
      $scope.instructions = instructions;
      init();
    }
  });

  function initializeTimes() {
    $scope.totalEndTime = 0;
    $scope.totalCurrentTime = 0;
    $scope.currentClip = 0;
    videos[0].currentTime = $scope.instructions[0].startTime;
    // console.log("at time init, videos[0].currentTime", videos[0].currentTime);
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
        //console.log("video", this.index, "played but it didn't affect the time");
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
    var isPlaying = !videos[$scope.currentClip].paused;
    pauseCurrentVideo();  // changes isPlaying t false
    $scope.isPlaying = isPlaying;
    $scope.totalCurrentTime = args[0].time;

    if ($scope.currentAudio) {
      $scope.currentAudio.domElement.currentTime = args[0].time;
    }

    // console.log("totalCurrentTime@ reaction in videoplayer", $scope.totalCurrentTime, "args", args);
    // console.log("startTime", $scope.instructions[0].startTime);

    updateVideo();
    if (!args[0].paused) {
      playCurrentVideo();
    }
  });

  $scope.$on('updatedTimeRange', (event, newTimes) => {
    //this event comes from the playerground and therefore only affects the 0th element of instructions
    $scope.instructions[0].startTime = Number(newTimes.startTime);
    $scope.instructions[0].endTime = Number(newTimes.endTime);
    initializeTimes();
  });

  $scope.$on('pauseButton', (event, ...args) => {
    //console.log("pauseButton event got")
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
    //console.log("HIT PLAY BUTTON, current clip is", $scope.currentClip, "total current time is", $scope.totalCurrentTime);
    playCurrentVideo();
    updateVideo();
  });

  function updateVideo() {
    //console.log("currently playing", $scope.videoPlayerId);
    //console.log("totalCurrentTime @ update", $scope.totalCurrentTime, "video paused", videos[$scope.currentClip].paused);
    var ended;

    if ($scope.audioenabled) {
      setVolume();
    }

    if ($scope.totalCurrentTime >= $scope.totalEndTime) {
      ended = true;
      //console.log("end of video");
      pauseCurrentVideo();
      if ($scope.audioenabled) {
        $scope.currentAudio.domElement.currentTime = 0;
      }
      return;
    }
    else {
      var foundSpot = false;
      var oldIndex = $scope.currentClip;
      var newIndex;
      for (var i = 0; i < videos.length; i++) {
        // sets indices
        //console.log("$scope.totalCurrentTime", $scope.totalCurrentTime,"timeBefore", videos[i].timeBefore);
        if ($scope.totalCurrentTime < videos[i].timeBefore) {
          //console.log("$scope.totalCurrentTime", $scope.totalCurrentTime,"timeBefore", videos[i].timeBefore);
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
          //console.log("clipToPlay", clipToPlay, "newIndex", newIndex);
          // I changed the clipToPlay.currentTime assignment because the preview wasn't working.
          // It would start the second clip much earlier than it was supposed to. Now it starts at the right time.
          // The downside is that the slider skips when the video switches now :( -Cristina
          // The formerly used assignment is still below, just commented out.
          clipToPlay.currentTime = $scope.totalCurrentTime - clipToPlay.timeBefore + $scope.instructions[newIndex].startTime;
          //clipToPlay.currentTime = $scope.instructions[newIndex].startTime;
          if (videos[oldIndex].ended || !videos[oldIndex].paused) {
            videos[oldIndex].pause();
            clipToPlay.play();
          }
          $scope.currentClip = newIndex;
        }
        if (foundSpot) break;
      }
      // if (!ended && !videos[$scope.currentClip].paused) {
      if (!ended && $scope.isPlaying) {
        timeoutId = setTimeout(updateVideo, 10);
      }
    }
  }


  function pauseCurrentVideo() {
    //console.log("current audio:", $scope.currentAudio);
    if ($scope.currentAudio) {
      $scope.currentAudio.domElement.pause();
    }
    videos[$scope.currentClip].pause();
    $scope.isPlaying = false;
    //console.log("pauseCurrentVideo was invoked");
    $scope.$broadcast('pauseCurrentVideo');
  }

  function playCurrentVideo() {
    if ($scope.currentAudio) {
      $scope.currentAudio.domElement.play();
    }
    $scope.isPlaying = true;
    videos[$scope.currentClip].play();
    $scope.$broadcast('playCurrentVideo');
  }

  $scope.getCurrentStartTime = function () {
    if ($scope.instructions.length === 0) {
      return 0;
    }
    return $scope.instructions[$scope.currentClip].startTime;
  };



 //                    _ _
 //     /\            | (_)
 //    /  \  _   _  __| |_  ___
 //   / /\ \| | | |/ _` | |/ _ \
 //  / ____ \ |_| | (_| | | (_) |
 // /_/    \_\__,_|\__,_|_|\___/


  if ($scope.audioenabled) {
    $scope.audioTracks = AudioFactory.getAudioElements();
    $scope.currentAudio = AudioFactory.getOriginalAudio();
  }

  $scope.audioObj = InstructionsFactory.getAudio(); // just for logging, remove later

  var initAudio = function () {
    // set current track depdendant on audio setting in InstructionsFactory
    // but keep default for editor
    if ($scope.videoPlayerId !== "editor") {
      var audioSetting = InstructionsFactory.getAudio();
      var audioElement = AudioFactory.getAudioElementByMongoId(audioSetting.id);
      if (audioElement) {
        $scope.currentAudio = audioElement;
      }
      $scope.fadeOut = audioSetting.fadeOut;
    }
    changeMute($scope.currentAudio.id !== "original_track");
    $scope.currentAudio.domElement.currentTime = 0;
  };

  var changeMute = function (newState) {
    videos.forEach(function (video) {
      video.muted = newState;
    });
  };

  $scope.$watch("fadeOut", function (newValue, oldValue) {
    if (newValue === oldValue) {
      return;
    }
    InstructionsFactory.getAudio().fadeOut = newValue;
  });


  $scope.$watch("currentAudio", function (newValue, oldValue) {
    if (newValue === oldValue) {
      return;
    }

    // if mp3 was deleted, change to original track
    if (newValue === null) {
      newValue = AudioFactory.getOriginalAudio();
      $scope.currentAudio = newValue;
    }

    InstructionsFactory.getAudio().id = newValue.videoSource.mongoId;


    if (newValue.id === "original_track") {
      changeMute(false);
    }

    if (oldValue && oldValue.id === "original_track") {
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

  //when the preview modal is exited, the audio track stops playing and resets to beginning
  $scope.$on('toggleModal', (e, shown) => {
    if(!shown){
      if($scope.currentAudio){
        $scope.currentAudio.domElement.pause = 0;
        $scope.currentAudio.domElement.currentTime = 0;
      }
    }
  })


  var resetVolume = function () {
      if (getCurrentVolume() === 1) {
        return;
      }
      $scope.currentAudio.domElement.volume = 1;
      videos[$scope.currentClip].volume = 1;
  };

  var getCurrentVolume = function () {
    if ($scope.currentAudio.id === "original_track") {
      return videos[$scope.currentClip].volume;
    }
    return $scope.currentAudio.domElement.volume;
  };

  var defaultVolume = 1;
  var fadeTreshold = 10; // in percent
  var setVolume = function () {
    if (!$scope.fadeOut) {
      resetVolume();
      return;
    }
    // FADEOUT
    var percentageLeft = 100 - (($scope.totalCurrentTime / $scope.totalEndTime) * 100);
    $scope.percentageLeft = percentageLeft;
    if (percentageLeft >= 0 && percentageLeft <= fadeTreshold) {
      var newVolume = percentageLeft / fadeTreshold;
      if ($scope.currentAudio.id === "original_track") {
        videos[$scope.currentClip].volume = newVolume;
      } else {
        $scope.currentAudio.domElement.volume = newVolume;
      }
    } else {
        resetVolume();
    }
  };


  $scope.$on("audioTracks changed", function () {
    //console.log("audioTracks changed:");
    $scope.$digest();
  });




});
