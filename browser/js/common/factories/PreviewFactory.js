app.factory("PreviewFactory", () => {
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
    }
  }
});
