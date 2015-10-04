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
      source: 'dragon.ogg',
      startTime: '50',
      endTime: '54',
      filter: 'bw'
    },{
      source: 'lego.ogv',
      startTime: '0',
      endTime: '4',
      filter: 'blur'
    },{
      source: 'dragon.ogg',
      startTime: '5',
      endTime: '10',
      filter: 'invert'
    },{
      source: 'lego.ogv',
      startTime: '0',
      endTime: '4',
      filter: 'sepia'
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

      [].forEach.call(videos, setUpPause);

      function setUpPause(video, index){
        var playDuration = 1000*($scope.instructions[index].endTime - $scope.instructions[index].startTime);
        video.addEventListener('play', ()=> {

          draw(video, context, cw, ch);

          setTimeout(() => {
            video.pause();
            if(index+1 < videos.length){
              var nextVideo = videos[index+1];
              nextVideo.currentTime = $scope.instructions[index+1].startTime;
              nextVideo.play();
              $scope.currentClip = index+1;
              $scope.$digest();
            }
          }, playDuration);

        }, false);
      }

      videos[0].currentTime = $scope.instructions[0].startTime;
      videos[0].play();
    }


  function draw(v, c, w, h){
    if(v.paused || v.ended) return false;
    c.drawImage(v,0,0,w,h);
    console.log("drew stuff");
    setTimeout(draw,20,v,c,w,h);
  }

});
