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
    return document.getElementById("editor");
  };

  $scope.$on("videosource-deleted", function (event, videoSourceId) {
    var video = getMainVideoPlayer();
    if (video.reelCoolVideoSourceId === videoSourceId) {
      video.src = null;
    }
  });

  $scope.$on('videoPlayerLoaded', (e, ...args) => {
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
    console.log("video", video);
    $video = $(video);
  };

  $scope.toggleFilter = (filter) => {

    $scope.filters.forEach(el => {
      if(filter.code ===""){
        el.applied = false;
      }
      else if(el.code === filter.code){
        el.applied = !el.applied;
      }
    });
    $scope.updateFilterString();
  };

  $scope.updateFilterString = () => {
    let newFilterStr = FilterFactory.createFilterString($scope.filters);
    console.log("video element:", $video);
    $video.attr('style', `-webkit-filter:${newFilterStr}`);
  };

  $scope.cutToInstructions = () => {
    console.log("cutToInstructions called")
    InstructionsFactory.add($scope.instructions);
  };

});
