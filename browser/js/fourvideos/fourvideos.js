app.config(($stateProvider) => {

    $stateProvider.state('fourvideos', {
        url: '/fourvideos',
        templateUrl: 'js/fourvideos/fourvideos.html',
        controller: 'FourVideosCtrl'
    });
});

app.controller('FourVideosCtrl', ($scope) => {
    $scope.currentClip = 0;
    $scope.totalCurrentTime = 0;
    $scope.totalEndTime = 0;
    $scope.videoPlayerWidth;

    $scope.instructions = [{
        source: 'lego.ogv',
        startTime: 0,
        endTime: 4,
        filter: 'blur'
    }, {
        source: 'IMG_2608.MOV',
        startTime: 30,
        endTime: 35,
        filter: 'bw'
    }, {
        source: 'lego.ogv',
        startTime: 2,
        endTime: 5,
        filter: 'sepia'
    }, {
        source: 'IMG_2608.MOV',
        startTime: 40,
        endTime: 45,
        filter: 'invert'
    }];

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
        }

        setVideoDimensions();

        var cumulativeTimeBefore = 0;

        for (var i = 0; i < $scope.instructions.length; i++) {
            //setUpPauseAndContinue(videos[i],i);
            addTimeUpdateEvents(videos[i], i);
            videos[i].timeBefore = cumulativeTimeBefore;
            cumulativeTimeBefore += $scope.instructions[i].endTime - $scope.instructions[i].startTime;
        }

        $scope.$on('newMovingTime', (event, ...args) => {
            $scope.totalCurrentTime = args[0];
            //console.log($scope.totalCurrentTime);
            console.log(timeoutId);
            clearTimeout(timeoutId);
            updateVideo();
            videos[$scope.currentClip].play();
            //console.log($scope.totalCurrentTime);
        })

        $scope.$on('UIpause', (event, ...args) => {
            [].forEach.call(videos, cancelSetUpPauses);
            videos[$scope.currentClip].pause();
        })

        $scope.$on('UIplay', (event, ...args) => {
            [].forEach.call(videos, cancelSetUpPauses);
            videos[$scope.currentClip].play();
        })

        // $scope.$on('previewMovingTime', (event, ...args) => {
        //   $scope.totalCurrentTime = args[0];
        //   setCurrentPlace();
        //   [].forEach.call(videos, cancelSetUpPauses);
        // })

        function cancelSetUpPauses(video) {
            if (video.currentSetTimeoutId) {
                clearTimeout(video.currentSetTimeoutId);
            }
        }

        timeoutId = setTimeout(updateVideo, 10);

        function updateVideo() {
            var ended;
            if ($scope.totalCurrentTime >= $scope.totalEndTime) {
                ended=true;
                videos[$scope.currentClip].pause();
            } else {
                for (var i = 0; i < videos.length; i++) {
                    var oldIndex = $scope.currentClip;
                    var newIndex;
                    var shouldBreak = false;
                    // sets indices
                  if ($scope.totalCurrentTime < videos[i].timeBefore) {
                        console.log('found spot at index ',i);
                        newIndex = i - 1;
                        console.log(newIndex);
                        shouldBreak=true;
                      }
                  else if (i === videos.length - 1) {
                      console.log('I am on the last video');
                        newIndex = i;
                        shouldBreak=true;
                    }
                    // evals whether video should change
                    if (newIndex && oldIndex !== newIndex) {
                        console.log('I should be in a different clip!')
                        var clipToPlay = videos[newIndex];
                        clipToPlay.currentTime = $scope.totalCurrentTime - clipToPlay.timeBefore + $scope.instructions[newIndex].startTime;
                        videos[oldIndex].pause();
                        videos[newIndex].play();
                        $scope.currentClip = newIndex;
                    }
                    if (shouldBreak) break;
                }
                if (!ended) timeoutId = setTimeout(updateVideo, 100);
            }
        }

        function addTimeUpdateEvents(video, index) {
            video.ontimeupdate = function() {
                $scope.totalCurrentTime = video.timeBefore + video.currentTime - $scope.instructions[index].startTime;
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
