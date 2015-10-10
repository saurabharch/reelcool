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

app.controller('PlaygroundCtrl', ($scope, FilterFactory, InstructionsFactory, PreviewFactory) => {

  var video, $video, videoPlayerId;

  $scope.$on("videosource-deleted", function (event, videoSourceId) {
    if (video.reelCoolVideoSourceId === videoSourceId) {
      video.src = null;
    }
  });

  $scope.$on('videoPlayerLoaded', (e, instructionVideoMap) => {
    video = document.getElementById(instructionVideoMap[$scope.instructions[0].id]);
    $video = $(video);
    initFilters();
  });

  $scope.updatedTimeRange = () => {
    $scope.$broadcast('updatedTimeRange');
  };

  function initFilters () {
    //get the available filters, none of them are applied
    $scope.filters = FilterFactory.filters.map(filter => {
        filter.applied = false;
        return filter;
    });
  }

  $scope.toggleFilter = (filter) => {

    $scope.filters.forEach(el => {
      if(filter.code ===""){
        el.applied = false;
      }
      else if(el.code === filter.code || el.applied){
        el.applied = !el.applied;
      }
    });
    saveFilterToInstructions();
    updateFilterString();
  };

  $scope.cutToInstructions = () => {
    console.log("cutToInstructions called")
    PreviewFactory.addToInstructions($scope.instructions);
    console.log("new preview instructions", PreviewFactory.getInstructions());
  };

  function updateFilterString() {
    let newFilterStr = FilterFactory.createFilterString($scope.filters);
    $video.attr('style', `-webkit-filter:${newFilterStr}`);
  }

  function saveFilterToInstructions (){
    console.log("will save",  $scope.filters.filter(el => el.applied)[0].code);
    $scope.instructions[0].filter = $scope.filters.filter(el => el.applied)[0].code;
  }

});
