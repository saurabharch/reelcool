app.config(($stateProvider) => {

    $stateProvider.state('fourvideos', {
        url: '/fourvideos',
        templateUrl: 'js/fourvideos/fourvideos.html',
        controller: 'FourVideosCtrl'
    });
});

app.controller('FourVideosCtrl', ($scope) => {

    var video = document.getElementById('video');
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var cw = Math.floor(canvas.clientWidth);
    var ch = Math.floor(canvas.clientHeight);
    canvas.width = cw;
    canvas.height = ch;
    video.addEventListener('play', ()=> {
      draw(video, context, cw, ch);
      //console.log("drew with", this, context, cw, ch);
    }, false);

    video.addEventListener('ended', ()=> {
      $scope.currentSource++;
      console.log("currentSource", $scope.currentSource);
      $scope.$digest();
      video.load();
    }, false);

    video.play();

  function draw(v, c, w, h){
    if(v.paused || v.ended) return false;
    c.drawImage(v,0,0,w,h);
    console.log("drew stuff");
    setTimeout(draw,20,v,c,w,h);
  }

  $scope.currentSource = 0;

  $scope.sources = [
    'lego.ogv',
    'IMG_2608.MOV',
    'lego.ogv',
    'lego.ogv'
  ];

  $scope.instructions = [];


});
