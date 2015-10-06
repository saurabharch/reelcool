app.directive('playground', () => {
  return {
    restrict: 'E',
    scope: {
      videoSource: '=',
      filters: '='
    },
    controller: 'PlaygroundCtrl',
    templateUrl: 'js/playground/playground.html'
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
    console.log("cutToInstructions called")
    InstructionsFactory.add($scope.tempInstructions);
  }

});
