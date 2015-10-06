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
    $scope.appliedFilters = [];
    var video = document.getElementsByTagName('video')[0];
    $scope.duration = video.duration;
    $scope.startTime = 0;
    $scope.endTime = $scope.duration;
    $scope.availableFilters = InstructionsFactory.filters;
  }

  $scope.toggleFilter = (filter) => {
    var filterIndex = _.findIndex($scope.appliedFilters, (el) => {
      return el.name === filter.name;
    });
    if(filterIndex>-1){
      $scope.appliedFilters.splice(filterIndex);
    }
    else {
      $scope.appliedFilters.push(filter);
    }
    console.log("applied",$scope.appliedFilters);
  }

  $scope.updateFilters = () => {

  }

  $scope.cutToInstructions = () => {
    console.log("cutToInstructions called")
    InstructionsFactory.add($scope.instructions);

  }

});
