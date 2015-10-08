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
      var $svg = $('svg');
      var svgLeftOffset = $svg.offset().left;
      console.log("svgPosition", svgLeftOffset);

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
        scope.$digest();
      })

      scope.$on('CTRLpause',() => {
        scope.paused = true;
      })

      // scope.$on('showSlider', () => {
      //   if(timeoutFade) {
      //     clearTimeout(timeoutFade);
      //   }
      //   slider.style.opacity = '.7';
      // })
      //
      // scope.$on('hideSlider', () => {
      //   // console.log("HIDE SLIDER");
      //   // $(slider).animate({opacity: 0}, 2000);
      // })

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

      sliderBar.addEventListener('click', moveDotFromClick);

      sliderDot.addEventListener('mousedown', () => {
        console.log("mousedown");
        sliderBar.removeEventListener('click', moveDotFromClick);
        var wasPaused = scope.paused;
        scope.$emit('UIpause');
        //wherever the mouse goes, its x value should transfer to the totalCurrentTime
        showSliderWithoutHover = true;
        document.addEventListener('mousemove', moveDot);
        document.addEventListener('mouseup', mouseUpSaveDot);
      });

        function mouseUpSaveDot(e) {
          document.removeEventListener('mousemove', moveDot);
          document.removeEventListener('mouseup', mouseUpSaveDot);
          setTimeout(() => {
            sliderBar.addEventListener('click', moveDotFromClick);
          },1);
          showSliderWithoutHover = false;
          var clickedX = e.clientX -svgLeftOffset;
          console.log('save dot x', clickedX);
          var newMovingTime = (clickedX)/scope.width * scope.endTime;
          console.log('slider says newMovingTime', newMovingTime);
          scope.$emit('newMovingTime', {time: newMovingTime, paused: scope.paused});
        }

        function moveDot(e){
          var movedX = e.clientX;
          scope.movingTime = (movedX)/scope.width * scope.endTime;
          scope.$digest();
          //scope.$emit('previewMovingTime', scope.movingTime);
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
  }
});
