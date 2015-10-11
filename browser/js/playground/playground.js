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
    console.log('all me filters!', $scope.filters)
  }

  $scope.clearFilter = (filter)=> {
    if(filter.applied)
      filter.applied = false;
  };
  $scope.x = 5;

  $scope.toggleFilter = (filter) => {
    if (filter.applied){
      filter.applied = false;
      updateFilterString();
      return;
    }
    else{
      filter.applied = true;
      $scope.filters.forEach(el => {
        if(filter.code ==="clear"){
          el.applied = false;
        }
        else if(filter.primary){
          if(el.primary && el!==filter){
            el.applied = false;
          }
        }
      });
    }
    updateFilterString();
  };

  $scope.cutToInstructions = () => {
    console.log("cutToInstructions called");
    /* Below assigns the 'filters' property of the instructions to an array 
    of objects (of the form {filterName: *filter name*, val: *value for filter*})*/ 
    $scope.instructions[0].filters=$scope.filters.filter(el => el.applied).map(el=>{filterName:el.displayName, val});
    PreviewFactory.addToInstructions($scope.instructions);
    console.log("new preview instructions", PreviewFactory.getInstructions());
  };

  function updateFilterString() {
    let newFilterStr = FilterFactory.createFilterString($scope.filters);
    $video.attr('style', `-webkit-filter:${newFilterStr}`);
  }

});
