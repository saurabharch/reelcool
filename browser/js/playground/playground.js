app.directive('playground', () => {
  return {
    restrict: 'E',
    scope: {
      instructions: '=',
      filters: '='
    },
    controller: 'PlaygroundCtrl',
    templateUrl: 'js/playground/playground.html'
  }
});

app.controller('PlaygroundCtrl', ($scope, FilterFactory, InstructionsFactory) => {

  var video;
  var $video;

  $scope.updatedTimeRange = () => {
    $scope.$broadcast('updatedTimeRange',$scope.instructions)
  }

  $scope.run = () => {
    $scope.filters = FilterFactory.filters.map(filter => {
        filter.applied = false;
        return filter;
    });

    video = document.getElementsByTagName('video')[0];
    $video = $(video);
    $scope.duration = video.duration;
    $scope.startTime = 0;
    $scope.endTime = $scope.duration;
  }

  $scope.toggleFilter = (filter) => {

    $scope.filters.forEach(el => {
      if(filter.code ===""){
        el.applied = false;
      }
      else if(el.code !== filter.code && el.type === filter.type && el.applied){
        el.applied = false;
      }
    })

    filter.applied = !filter.applied;
    $scope.updateFilterString();
  }

  $scope.updateFilterString = () => {
    let newFilterStr = FilterFactory.createFilterString($scope.filters);
    $video.attr('style', `-webkit-filter:${newFilterStr}`);
  }

  $scope.cutToInstructions = () => {
    console.log("cutToInstructions called")
    InstructionsFactory.add($scope.instructions);
  }

});
