app.directive("timeSlider", () => {
  return {
    restrict: 'E',
    templateUrl: 'js/common/directives/slider/slider.html',
    scope: {
      movingTime: '=',
      startTime: '=',
      endTime: '='
    },
    link: (scope, elements, attr) => {
      var slider = elements[0];
      slider.style.opacity = "0";
      $(slider).animate({opacity: .7}, 2000);
      setTimeout(() => {
        $(slider).animate({opacity: 0}, 1000);
      }, 3000);

      var showSliderWithoutHover = false;

      slider.addEventListener('mouseenter', () => {
        slider.style.opacity = '.7';
      })

      slider.addEventListener('mouseleave', () => {
        if(!showSliderWithoutHover){
          slider.style.opacity = '0';
        }
      })

      var sliderDot = document.getElementById('slider-dot');
      console.log("sliderDot", sliderDot);
      sliderDot.addEventListener('mousedown', () => {
        console.log("startSearch");
        scope.$emit('startSearch');
        //wherever the mouse goes, its x value should transfer to the totalCurrentTime
        showSliderWithoutHover = true;
        document.addEventListener('mousemove', moveDot);
        document.addEventListener('mouseup', mouseUpSaveDot);

        function mouseUpSaveDot(e){
          document.removeEventListener('mousemove', moveDot);
          document.removeEventListener('mouseup', mouseUpSaveDot);
          showSliderWithoutHover = false;
          var clickedX = e.clientX;
          var newMovingTime = (clickedX - 140)/1120 * scope.endTime;
          scope.$emit('newMovingTime', newMovingTime);
        }

        function moveDot(e){
          var movedX = e.clientX;
          scope.movingTime = (movedX - 140)/1120 * scope.endTime;
          scope.$digest();
          scope.$emit('previewMovingTime', scope.movingTime);
        }
      })

      slider.addEventListener('click', (e) => {
        //x value of coordinate  -> totalCurrentTime
        console.log('clicked x', e.clientX);
        var clickedX = e.clientX;
        var newMovingTime = (clickedX - 140)/1120 * scope.endTime;
        scope.$emit('newMovingTime', newMovingTime);
      })
    }
  }
});
