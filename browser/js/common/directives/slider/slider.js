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
      var slider = elements[0];
      var sliderBar = document.getElementById('slider-bar');
      var pauseButton = document.getElementById('pause-button');
      var playButton = document.getElementById('play-button');

      //opening slider animation
      slider.style.opacity = "0";
      $(slider).animate({opacity: .7}, 2000);
      var timeoutFade = setTimeout(() => {
        scope.$emit('hideSlider');
      }, 3000);

      var showSliderWithoutHover = false;
      scope.paused = false;

      scope.$on('UIpause', () => {
        scope.paused = true;
      });

      scope.$on('UIplay', () => {
        scope.paused = false;
      })

      scope.$on('CTRLplay',() => {
        scope.paused = false;
      })

      scope.$on('showSlider', () => {
        if(timeoutFade) {
          clearTimeout(timeoutFade);
        }
        slider.style.opacity = '.7';
      })

      scope.$on('hideSlider', () => {
        // console.log("HIDE SLIDER");
        // $(slider).animate({opacity: 0}, 2000);
      })

      pauseButton.addEventListener('click', () => {
        scope.$emit('UIpause');
      });

      playButton.addEventListener('click', () => {
        scope.$emit('UIplay');
      });

      slider.addEventListener('mouseover', () => {
        scope.$emit('showSlider');
      })

      slider.addEventListener('mouseout', () => {
        if(!showSliderWithoutHover && !scope.paused){
          scope.$emit('hideSlider');
        }
      })

      var sliderDot = document.getElementById('slider-dot');
      console.log("sliderDot", sliderDot);
      sliderDot.addEventListener('mousedown', () => {
        scope.$emit('UIpause');
        //wherever the mouse goes, its x value should transfer to the totalCurrentTime
        showSliderWithoutHover = true;
        document.addEventListener('mousemove', moveDot);
        document.addEventListener('mouseup', mouseUpSaveDot);

        function mouseUpSaveDot(e){
          document.removeEventListener('mousemove', moveDot);
          document.removeEventListener('mouseup', mouseUpSaveDot);
          showSliderWithoutHover = false;
          var clickedX = e.clientX;
          var newMovingTime = (clickedX)/scope.width * scope.endTime;
          scope.$emit('newMovingTime', newMovingTime);
        }

        function moveDot(e){
          var movedX = e.clientX;
          scope.movingTime = (movedX)/scope.width * scope.endTime;
          scope.$digest();
          scope.$emit('previewMovingTime', scope.movingTime);
        }
      })

      sliderBar.addEventListener('click', (e) => {
        //x value of coordinate  -> totalCurrentTime
        console.log('clicked x', e.clientX);
        var clickedX = e.clientX;
        var newMovingTime = (clickedX)/scope.width * scope.endTime;
        //scope.$emit('newMovingTime', newMovingTime);
      })
    }
  }
});
