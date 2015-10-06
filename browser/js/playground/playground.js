app.directive('playground', () => {
  return {
    restrict: 'E',
    scope: {
      videoSource: '=',
      filters: '='
    },
    controller: 'PlaygroundCtrl'
  }
});

app.controller('PlaygroundCtrl', ($scope, InstructionsFactory) => {
  $scope.run = () => {
    var video = document.getElementsByTagName('video')[0];
    $scope.duration = video.duration;
    $scope.startTime = 0;
    $scope.endTime = $scope.duration;
  }

  $scope.tempInstructions = {};

  $scope.cutToInstructions = () => {
    InstructionsFactory.add($scope.tempInstructions);
  }

});
