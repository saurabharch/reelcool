app.factory('InstructionsFactory',function(){
	var instructions = [];

	return {
		add: (instruction) => {
			instructions.push(instruction);
		},
		get: () => {
			return instructions
		}
	}
});
