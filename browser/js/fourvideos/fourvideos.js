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
    $scope.instructions = [{
      source: 'lego.ogv',
      startTime: '0',
      endTime: '4',
      duration: 4,
      filter: 'blur'
    },{
      source: 'IMG_2608.MOV',
      startTime: '30',
      endTime: '35',
      duration: 5,
      filter: 'bw'
    },{
      source: 'lego.ogv',
      startTime: '0',
      endTime: '4',
      duration: 4,
      filter: 'sepia'
    },{
      source: 'IMG_2608.MOV',
      startTime: '05',
      endTime: '40',
      duration: 35,
      filter: 'invert'
    }];
    $scope.instructions.forEach(function(instruction){
      $scope.totalEndTime+=Number(instruction.endTime);
      $scope.totalEndTime-=Number(instruction.startTime);
    });

    setTimeout(run, 1000);

    var videos;

    function run() {
      videos = document.getElementsByClassName('hiddenVideo');

      var canvas = document.getElementById('canvas');
      var context = canvas.getContext('2d');
      var pointer = document.getElementsByClassName('rz-pointer')[0];
      var bubble = document.getElementsByClassName('rz-bubble');
      console.log("bubble", bubble);
      //var pointerTidocument.getElementsByClassName('rz-bubble')[2]
      //var sliderTime = Number(document.getElementsByClassName('rz-bubble')[2].innerHTML);

      var cw = Math.floor(canvas.clientWidth);
      var ch = Math.floor(canvas.clientHeight);
      canvas.width = cw;
      canvas.height = ch;
      var cumulativeTimeBefore = 0;

      for(var i = 0; i < $scope.instructions.length; i++){
        setUpPause(videos[i],i);
        addTimeUpdateEvents(videos[i],i);
        videos[i].timeBefore = cumulativeTimeBefore;
        cumulativeTimeBefore += $scope.instructions[i].duration;
      }
      [].forEach.call(videos, video => video.load());

      function setUpPause(video, index){
        video.addEventListener('play', ()=> {
          console.log("playing video", index);
          for(var i = 0; i<videos.length; i++){
            if(i!==index){
              videos[i].pause();
            }
          }
          var playDuration = 1000*($scope.instructions[index].endTime - video.currentTime);

          if(video.currentSetTimeoutId){
            clearTimeout(video.currentSetTimeoutId);
            console.log("cleared timeout for video", index);
          }

          video.currentSetTimeoutId = setTimeout(() => {
            video.pause();
            console.log("stopped video", index);
            if(index+1 < videos.length){
              var nextVideo = videos[index+1];
              nextVideo.currentTime = $scope.instructions[index+1].startTime;
              nextVideo.play();
              $scope.currentClip = index+1;
              $scope.$digest();
            }
          }, playDuration);

          console.log("set new timeout for video", index, "totalCurrentTime", $scope.totalCurrentTime);

          draw(video, context, cw, ch);

        }, false);
      }

      function addTimeUpdateEvents(video, index){
        video.ontimeupdate = function(){
          $scope.totalCurrentTime = video.timeBefore + video.currentTime -$scope.instructions[index].startTime;
          $scope.$digest();
        };
      }
      pointer.onmousedown=function(){
          console.log("pointer mousedown @ time", $scope.totalCurrentTime);
          var playingClip = videos[$scope.currentClip];
          console.log("pausing", playingClip)
          playingClip.pause();
          document.onmouseup=function(){
            console.log("slider time at mouseup", $scope.totalCurrentTime);
            for(var i = 0; i<videos.length; i++){
              if(videos[i].timeBefore> $scope.totalCurrentTime){
                $scope.currentClip = i-1;
                $scope.$digest();
                playingClip = videos[$scope.currentClip]
                console.log("new current video", i-1);
                break;
              }
            }
            playingClip.currentTime = $scope.totalCurrentTime-playingClip.timeBefore;
            playingClip.play();
            document.onmouseup = null;
          };
      };

      videos[0].currentTime = $scope.instructions[0].startTime;
      videos[0].play();
    }



    function draw(v, c, w, h){
      if(v.paused || v.ended) return false;
      c.drawImage(v,0,0,w,h);
      setTimeout(draw,20,v,c,w,h);
    }

});
