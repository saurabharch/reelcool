app.directive('videoPlayer', () => {
  return {
    restrict: 'E',
    scope: {
      videoSource : '='
    },
    templateUrl: 'js/common/directives/videoplayer/videoplayer.html'
  };
});
