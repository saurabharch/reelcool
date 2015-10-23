app.directive('playground', () => {
  return {
    restrict: 'E',
    scope: {
    },
    controller: 'PlaygroundCtrl',
    templateUrl: 'js/playground/playground.html'
  };
});

app.controller('PlaygroundCtrl', ($scope, FilterFactory, InstructionsFactory, $rootScope ) => {

  var video, $video, videoPlayerId;
  $scope.filters = FilterFactory.filters;

  $scope.$on("videosource-deleted", function (event, videoSourceId) {
    if (video && (video.reelCoolVideoSourceId === videoSourceId)) {
      video.src = null;
    }
  });

  $scope.$on("changeVideo", function(e, instructions, targetVideoplayerId) {
    $scope.instructions = instructions;
    initFilters();
  });

  $scope.$on('videoPlayerLoaded', (e, instructionVideoMap) => {
    video = document.getElementById(instructionVideoMap[$scope.instructions[0].id]);
    $video = $(video);
  });

  $scope.updatedTimeRange = () => {
    $scope.$broadcast('updatedTimeRange', {startTime: $scope.newStartTime, endTime: $scope.newEndTime});
  };

  function initFilters () {
    //get the available filters, none of them are applied
    if($scope.instructions[0].edited){
      $scope.filters = FilterFactory.parseFilterString($scope.instructions[0].filterString);
    }
    else{
      $scope.filters = angular.copy(FilterFactory.filters);
    }
    $scope.$watch('filters',function(newVal,oldVal){
      $scope.instructions[0].filterString = FilterFactory.createFilterString(newVal);
    }, true);
  }


  $scope.toggleFilter = (filter) => {
    if (filter.applied){
      filter.applied = false;
      filter.val = filter.default;
      return;
    }
    else{
      filter.applied = true;
      $scope.filters.forEach(el => {
        if(filter.code ==="clear"){
          el.applied = false;
          el.val = el.default;
        }
        else if(filter.primary){
          if(el.primary && el!==filter){
            el.applied = false;
            el.val = el.default;
          }
        }
      });
      if(filter.displayName=='Invert'||filter.displayName=="Sepia"||filter.displayName=="Grayscale") filter.val = 1;
    }
    console.log('instructions', $scope.instructions[0]);
  };

  $scope.cutToInstructions = () => {
    //console.log("cutToInstructions called, $scope.instructions[0]", $scope.instructions[0]);
    $scope.instructions[0].edited = true;

    var instructionsCopy = {};
    _.assign(instructionsCopy, $scope.instructions[0]);
    //console.log("instructionsCopy from playground", instructionsCopy);
    $rootScope.$broadcast('sendClipToReel', instructionsCopy);
  };

});
