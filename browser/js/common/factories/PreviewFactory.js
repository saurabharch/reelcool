app.factory("PreviewFactory", ($mdDialog) => {
  var instructions = [];

  return {
    addToInstructions: (newClips) => {
      instructions = instructions.concat(...newClips);
    },
    setInstructions: (newInstructions) => {
      instructions = [];
      instructions = instructions.concat(...newInstructions);
    },
    getInstructions: () => {
      return instructions;
    }
  }
});
