app.factory("PreviewFactory", ($mdDialog) => {
  var instructions = [];

  return {
    addToInstructions: (newClips) => {
      instructions = instructions.concat(...newClips);
    },
    setInstructions: (newInstructions) => {
      instructions = newInstructions;
    },
    getInstructions: () => {
      return instructions;
    },
    showPreview: ($event, instructions) => {
      var parentEl = angular.element(document.body);
      $mdDialog.show({
        clickOutsideToClose: true,
        //parent: parentEl,
        targetEvent: $event,
        templateUrl: 'js/preview/preview.html',
        locals: {
          instructions: instructions
        },
        controller: "PreviewController"
      })
    }
  }
});
