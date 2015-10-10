app.directive("timeSlider", () => {
  return {
    restrict: 'E',
    templateUrl: 'js/common/directives/slider/slider.html',
    scope: {
      movingTime: '=',
      startTime: '=',
      endTime: '=',
      width : '='
    },
    link: (scope, elements, attr) => {


//  _____       _ _   _       _ _          _   _
 // |_   _|     (_) | (_)     | (_)        | | (_)
 //   | |  _ __  _| |_ _  __ _| |_ ______ _| |_ _  ___  _ __
 //   | | | '_ \| | __| |/ _` | | |_  / _` | __| |/ _ \| '_ \
 //  _| |_| | | | | |_| | (_| | | |/ / (_| | |_| | (_) | | | |
 // |_____|_| |_|_|\__|_|\__,_|_|_/___\__,_|\__|_|\___/|_| |_|


      var slider = elements[0];
      var sliderBar = document.getElementById('slider-bar');
      var sliderDot = document.getElementById('slider-dot');
      var pauseButton = document.getElementById('pause-button');
      var playButton = document.getElementById('play-button');
      var $svg = $('svg');
      var svgLeftOffset = $svg.offset().left;
      console.log("svgPosition", svgLeftOffset);

      scope.movingTime = scope.movingTime || 0;
      scope.endTime = scope.endTime || 1;

      //opening slider animation
      slider.style.opacity = "0";
      $(slider).animate({opacity: .7}, 2000);
      var timeoutFade = setTimeout(() => {
        scope.$emit('hideSlider');
      }, 3000);

      //var showSliderWithoutHover = false;
      scope.paused = false;


      sliderBar.addEventListener('click', moveDotFromClick);

      sliderDot.addEventListener('mousedown', () => {
        console.log("mousedown");
        sliderBar.removeEventListener('click', moveDotFromClick);
        //wherever the mouse goes, its x value should transfer to the totalCurrentTime
        //showSliderWithoutHover = true;
        document.addEventListener('mousemove', moveDot);
        document.addEventListener('mouseup', mouseUpSaveDot);
      });

      pauseButton.addEventListener('click', () => {
        scope.$emit('pauseButton');
      });

      playButton.addEventListener('click', () => {
        scope.$emit('playButton');
      });


 //  ______               _     _    _                 _ _ _
 // |  ____|             | |   | |  | |               | | (_)
 // | |____   _____ _ __ | |_  | |__| | __ _ _ __   __| | |_ _ __   __ _
 // |  __\ \ / / _ \ '_ \| __| |  __  |/ _` | '_ \ / _` | | | '_ \ / _` |
 // | |___\ V /  __/ | | | |_  | |  | | (_| | | | | (_| | | | | | | (_| |
 // |______\_/ \___|_| |_|\__| |_|  |_|\__,_|_| |_|\__,_|_|_|_| |_|\__, |
 //                                                                 __/ |
 //                                                                |___/


      scope.$on('pauseButton', () => {
        scope.paused = true;
      });

      scope.$on('playButton', () => {
        scope.paused = false;
      })

      scope.$on('pauseCurrentVideo',() => {
        scope.paused = true;
      })

      scope.$on('playCurrentVideo',() => {
        scope.paused = false;
      })

      function mouseUpSaveDot(e) {
        document.removeEventListener('mousemove', moveDot);
        document.removeEventListener('mouseup', mouseUpSaveDot);
        setTimeout(() => {
          sliderBar.addEventListener('click', moveDotFromClick);
        },1);
        //showSliderWithoutHover = false;
        var clickedX = e.clientX -svgLeftOffset;
        console.log('save dot x', clickedX);
        var newMovingTime = (clickedX)/scope.width * scope.endTime;
        console.log('slider says newMovingTime', newMovingTime);
        scope.$emit('newMovingTime', {time: newMovingTime, paused: scope.paused});
      }

      function moveDot(e){
        //svgLeftOffset = $svg.offset().left;
        var movedX = e.clientX - svgLeftOffset;
        scope.movingTime = (movedX)/scope.width * scope.endTime;
        scope.$digest();
      }

      function moveDotFromClick(e) {
        //x value of coordinate  -> totalCurrentTime
        console.log('clicked x', e.clientX);
        var clickedX = e.clientX - svgLeftOffset;
        var newMovingTime = (clickedX)/scope.width * scope.endTime;
        console.log('clicked slider says newMovingTime', newMovingTime);
        scope.$emit('newMovingTime', {time: newMovingTime, paused: scope.paused});
      }

    }
  };
});
