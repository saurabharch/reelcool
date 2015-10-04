app.config(($stateProvider) => {

    $stateProvider.state('fourvideos', {
        url: '/fourvideos',
        templateUrl: 'js/fourvideos/fourvideos.html',
        controller: 'FourVideosCtrl'
    });
});

app.controller('FourVideosCtrl', ($scope) => {
    $scope.currentClip = 0;
    $scope.currentTime = 0;
    $scope.endTime = 0;
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
      $scope.endTime+=Number(instruction.endTime);
      $scope.endTime-=Number(instruction.startTime);
    });

    setTimeout(run, 1000);

    var videos;

    function run() {
      videos = document.getElementsByClassName('hiddenVideo');
      console.log("videos", typeof videos);

      var canvas = document.getElementById('canvas');
      var context = canvas.getContext('2d');
      var pointer = document.getElementsByClassName('rz-pointer')[0];

      var cw = Math.floor(canvas.clientWidth);
      var ch = Math.floor(canvas.clientHeight);
      canvas.width = cw;
      canvas.height = ch;
      var beforeTime = 0;

      for(var i = 0; i < $scope.instructions.length; i++){
        setUpPause(videos[i],i);
        addTimeUpdateEvents(videos[i],i);
        videos[i].timeBefore = beforeTime;
        beforeTime+=$scope.instructions[i].duration;
      }
      [].forEach.call(videos, video => video.load());

      function setUpPause(video, index){
        video.addEventListener('play', ()=> {
          var playDuration = 1000*($scope.instructions[index].endTime - video.currentTime);

          if(video.currentSetTimeoutId){
            clearTimeout(video.currentSetTimeoutId);
          }

          video.currentSetTimeoutId = setTimeout(() => {
            video.pause();
            if(index+1 < videos.length){
              var nextVideo = videos[index+1];
              nextVideo.currentTime = $scope.instructions[index+1].startTime;
              nextVideo.play();
              $scope.currentClip = index+1;
              $scope.$digest();
            }
          }, playDuration);

          draw(video, context, cw, ch);

        }, false);
      }

      function addTimeUpdateEvents(video, index){
        video.ontimeupdate = function(){
          $scope.currentTime = video.currentTime+video.timeBefore-$scope.instructions[index].startTime;
          $scope.$digest();
        };
      }
      pointer.onmousedown=function(){
          videos[$scope.currentClip].pause();
          document.onclick=function(){
            var sliderTime = Number(document.getElementsByClassName('rz-bubble')[2].innerHTML);
            for(var i = 0; i<videos.length; i++){
              if(sliderTime >= videos[i].timeBefore && sliderTime < videos[i].timeBefore + $scope.instructions[i].duration){
                $scope.currentClip = i;
                $scope.$digest();
                break;
              }
            }
            var currClip = videos[$scope.currentClip];
            currClip.currentTime=sliderTime-currClip.timeBefore;
            currClip.play();
            document.onclick = null;
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
