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
      filter: 'grayscale'
    },{
      source: 'lego.ogv',
      startTime: '0',
      endTime: '4',
      filter: 'blur'
    },{
      source: 'dragon.ogg',
      startTime: '155',
      endTime: '160',
      filter: 'blur'
    }];

    var video = document.getElementById('hiddenVideo');
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var cw = Math.floor(canvas.clientWidth);
    var ch = Math.floor(canvas.clientHeight);
    canvas.width = cw;
    canvas.height = ch;

    video.addEventListener('play', ()=> {
      draw(video, context, cw, ch);
    }, false);

    video.addEventListener('play', ()=> {
      console.log("play happened");

      var clipDuration = 1000 * ($scope.instructions[$scope.currentClip].endTime - $scope.instructions[$scope.currentClip].startTime);
      setTimeout(() => {
        //stop current video when its clip is done
        video.pause();
        //IF there is another one, play it
        if($scope.currentClip + 1  < $scope.instructions.length){
          $scope.currentClip++;
          $scope.$digest();
          video.load();
          video.currentTime = $scope.instructions[$scope.currentClip].startTime;
        }
        else{
          video.pause();
        }
      }, clipDuration);
    }, false);

    // video.addEventListener('ended', ()=> {
    //   $scope.currentClip++;
    //   $scope.$digest();
    //   video.load();
    // }, false);

    video.currentTime = $scope.instructions[$scope.currentClip].startTime;
    video.play();


  function draw(v, c, w, h){
    if(v.paused || v.ended) return false;
    c.drawImage(v,0,0,w,h);
    console.log("drew stuff");
    setTimeout(draw,20,v,c,w,h);
  }


});
