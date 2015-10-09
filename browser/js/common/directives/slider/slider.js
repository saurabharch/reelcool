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

      pauseButton.addEventListener('click', () => {
        scope.$emit('pauseButton');
      });

      playButton.addEventListener('click', () => {
        scope.$emit('playButton');
      });

      sliderBar.addEventListener('click', moveDotFromClick);

      sliderDot.addEventListener('mousedown', () => {
        console.log("mousedown");
        sliderBar.removeEventListener('click', moveDotFromClick);
        scope.$emit('pauseButton');
        //wherever the mouse goes, its x value should transfer to the totalCurrentTime
        //showSliderWithoutHover = true;
        document.addEventListener('mousemove', moveDot);
        document.addEventListener('mouseup', mouseUpSaveDot);
      });

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

        // slider.addEventListener('mouseover', () => {
        //   scope.$emit('showSlider');
        // })
        //
        // slider.addEventListener('mouseout', () => {
        //   if(!showSliderWithoutHover && !scope.paused){
        //     scope.$emit('hideSlider');
        //   }
        // })
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
    }
  }
});
