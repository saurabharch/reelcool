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

      slider.addEventListener('mouseenter', () => {
        slider.style.opacity = '.7';
      })

      slider.addEventListener('mouseleave', () => {
        slider.style.opacity = '0';
      })
      // var sliderBg = document.getElementById('slider-bg');
      // var sliderMercury = document.getElementById('slider-mercury');
      var sliderDot = document.getElementById('slider-dot');
      console.log('sliderDot', sliderDot);

      // sliderDot.addEventListener('mousedown', () => {
      //   //wherever the mouse goes, its x value should transfer to the totalCurrentTime
      //   document.addEventListener('mousemove', (e) => {
      //     var clickedX = e.clientX;
      //     scope.movingTime = (clickedX - 140)/1120 * scope.endTime;
      //     console.log("new moving Time", scope.movingTime);
      //   })
      // })

      slider.addEventListener('click', (e) => {
        //x value of coordinate  -> totalCurrentTime
        console.log('clicked x', e.clientX);
        var clickedX = e.clientX;
        var newMovingTime = (clickedX - 140)/1120 * scope.endTime;
        scope.$emit('newMovingTime', newMovingTime);
        console.log("new moving Time", scope.movingTime);
      })
      // sliderBg.style.visibility = "hidden";
      // sliderMercury.style.visibility = "hidden";
      // sliderDot.style.visibility = "hidden";
      // console.log("inside link", sliderBg, sliderMercury, sliderDot);
      // sliderBg.addEventListener('mouseenter', (e)=> {
      //   console.log("mouse entered");
      //   sliderBg.style.visibility = "visible";
      //   sliderMercury.style.visibility = "visible";
      //   sliderDot.style.visibility = "visible";
      // });
      // sliderBg.addEventListener('mouseleave',(e)=> {
      //   console.log("mouse left");
      //   sliderBg.style.visibility = "hidden";
      //   sliderMercury.style.visibility = "hidden";
      //   sliderDot.style.visibility = "hidden";
      // });
    }
  }
});
