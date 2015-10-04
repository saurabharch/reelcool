app.config(($stateProvider) => {

    $stateProvider.state('fourvideos', {
        url: '/fourvideos',
        templateUrl: 'js/fourvideos/fourvideos.html',
        controller: 'FourVideosCtrl'
    });
});

app.controller('FourVideosCtrl', ($scope) => {
    $scope.currentClip = 0;

    $scope.instructions = [{
      source: 'lego.ogv',
      startTime: '0',
      endTime: '4',
      filter: 'blur'
    },{
      source: 'IMG_2608.MOV',
      startTime: '30',
      endTime: '35',
      filter: 'bw'
    },{
      source: 'lego.ogv',
      startTime: '0',
      endTime: '4',
      filter: 'sepia'
    },{
      source: 'IMG_2608.MOV',
      startTime: '35',
      endTime: '40',
      filter: 'invert'
    }];

    setTimeout(run, 1000);

    var videos;

    function run() {
      videos = document.getElementsByClassName('hiddenVideo');
      console.log("videos", typeof videos);

      var canvas = document.getElementById('canvas');
      var context = canvas.getContext('2d');
      var cw = Math.floor(canvas.clientWidth);
      var ch = Math.floor(canvas.clientHeight);
      canvas.width = cw;
      canvas.height = ch;

      [].forEach.call(videos, video => video.load());
      [].forEach.call(videos, setUpPause);

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

      videos[0].currentTime = $scope.instructions[0].startTime;
      videos[0].play();
    }


  function draw(v, c, w, h){
    if(v.paused || v.ended) return false;
    c.drawImage(v,0,0,w,h);
    setTimeout(draw,20,v,c,w,h);
  }

});
