app.directive('playground', () => {
  return {
    restrict: 'E',
    scope: {
      instructions: '='
    },
    controller: 'PlaygroundCtrl',
    templateUrl: 'js/playground/playground.html'
  };
});

app.controller('PlaygroundCtrl', ($scope, FilterFactory, InstructionsFactory) => {

  var video, $video;

  var getMainVideoPlayer = function () {
    return document.getElementById($scope.instructions[0].id);
  };

  $scope.$on("videosource-deleted", function (event, videoSourceId) {
    var video = getMainVideoPlayer();
    if (video.reelCoolVideoSourceId === videoSourceId) {
      video.src = null;
    }
  });

  $scope.$on('videoPlayerLoaded', (e, ...args) => {
    console.log("got event videoPlayerLoaded");
    $scope.run();
  });

  $scope.updatedTimeRange = () => {
    $scope.$broadcast('updatedTimeRange');
  };

  //get the available filters, none of them are applied
  $scope.filters = FilterFactory.filters.map(filter => {
      filter.applied = false;
      return filter;
  });

  $scope.run = () => {
    video = getMainVideoPlayer();
    $video = $(video);
  };

  $scope.toggleFilter = (filter) => {

    $scope.filters.forEach(el => {
      if(filter.code ===""){
        el.applied = false;
      }
      else if(el.code === filter.code || el.applied){
        el.applied = !el.applied;
      }
    });
    $scope.updateFilterString();
  };

  $scope.updateFilterString = () => {
    console.log("scope.filters", $scope.filters);
    let newFilterStr = FilterFactory.createFilterString($scope.filters);
    $video.attr('style', `-webkit-filter:${newFilterStr}`);
  };

  $scope.cutToInstructions = () => {
    console.log("cutToInstructions called")
    InstructionsFactory.add($scope.instructions);
  };

});
