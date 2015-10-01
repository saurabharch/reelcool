app.directive('videoPlayer', () => {
  return {
    restrict: 'E',
    scope: {
      source : '='
    },
    templateUrl: 'js/common/directives/videoplayer/videoplayer.html'
  }
})
