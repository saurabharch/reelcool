app.factory("PreviewFactory", () => {
  var instructions;

  return {
    setInstructions: (newInstructions) => {
      instructions = newInstructions;
    },
    getInstructions: () => {
      return instructions;
    }
  }
})
