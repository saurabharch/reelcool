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

app.controller('PlaygroundCtrl', ($scope, FilterFactory, InstructionsFactory, PreviewFactory, $rootScope ) => {

  var video, $video, videoPlayerId;

  $scope.$on("videosource-deleted", function (event, videoSourceId) {
    if (video.reelCoolVideoSourceId === videoSourceId) {
      video.src = null;
    }
  });

  $scope.$on("changeVideo", function(e, instructions, targetVideoplayerId) {
    initFilters();
    $scope.filters.forEach((filt,ind1) => {
      instructions.filters.forEach((prevFilt,ind2) => {
        if(filt.displayName==prevFilt.displayName)
          $scope.filters[ind1] = instructions.filters[ind2];
      });
    });
  });

  $scope.$on('videoPlayerLoaded', (e, instructionVideoMap) => {
    video = document.getElementById(instructionVideoMap[$scope.instructions[0].id]);
    $video = $(video);
    initFilters();
  });

  $scope.updatedTimeRange = () => {
    $scope.$broadcast('updatedTimeRange', {startTime: $scope.newStartTime, endTime: $scope.newEndTime});
  };

  function initFilters () {
    //get the available filters, none of them are applied
    $scope.filters = FilterFactory.filters.map(filter => {
        filter.applied = false;
        return filter;
    });
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
  };

  $scope.cutToInstructions = () => {
    console.log("cutToInstructions called, $scope.instructions[0]", $scope.instructions[0]);
    //PreviewFactory.addToInstructions($scope.instructions);
    $scope.instructions[0].edited = true;
    var instructionsCopy = {};
    // for(var key in Object.keys($scope.instructions[0])){
    //   instructionsCopy[key] = $scope.instructions[0][key];
    // }
    $scope.instructions[0].filters=$scope.filters.filter(el => el.applied);

    _.assign(instructionsCopy, $scope.instructions[0]);
    //angular.copy($scope.instructions[0], instructionsCopy);
    console.log("instructionsCopy from playground", instructionsCopy);

    $rootScope.$broadcast('sendClipToReel', instructionsCopy);
    initFilters();
  };

});
