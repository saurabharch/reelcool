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
      console.log("elements", elements);
      var slider = elements[0];
      console.log('slider', slider);
      slider.style.opacity = "0";
      var showSliderWithoutHover = false;

      slider.addEventListener('mouseenter', () => {
        slider.style.opacity = '.7';
      })

      slider.addEventListener('mouseleave', () => {
        if(!showSliderWithoutHover){
          slider.style.opacity = '0';
        }
      })
      // var sliderBg = document.getElementById('slider-bg');
      // var sliderMercury = document.getElementById('slider-mercury');
      var sliderDot = document.getElementById('slider-invisible-dot');
      console.log("sliderDot", sliderDot);
      sliderDot.addEventListener('mousedown', () => {
        console.log("mousedown on dot");
        //wherever the mouse goes, its x value should transfer to the totalCurrentTime
        showSliderWithoutHover = true;
        document.addEventListener('mousemove', moveDot);
        document.addEventListener('mouseup', (e) => {
          document.removeEventListener('mousemove', moveDot);
          showSliderWithoutHover = false;
          var clickedX = e.clientX;
          var newMovingTime = (clickedX - 140)/1120 * scope.endTime;
          scope.$emit('newMovingTime', newMovingTime);
        });

        function moveDot(e){
          var movedX = e.clientX;
          console.log("movedX", movedX);
          scope.movingTime = (movedX - 140)/1120 * scope.endTime;
          scope.$digest();
        }
      })

      slider.addEventListener('click', (e) => {
        //x value of coordinate  -> totalCurrentTime
        console.log('clicked x', e.clientX);
        var clickedX = e.clientX;
        var newMovingTime = (clickedX - 140)/1120 * scope.endTime;
        scope.$emit('newMovingTime', newMovingTime);
      })

      // sliderBg.addEventListener('mouseleave',(e)=> {
      //   console.log("mouse left");
      //   sliderBg.style.visibility = "hidden";
      //   sliderMercury.style.visibility = "hidden";
      //   sliderDot.style.visibility = "hidden";
      // });
    }
  }
});
