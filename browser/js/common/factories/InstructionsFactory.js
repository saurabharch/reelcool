app.factory('InstructionsFactory',function (IdGenerator) {
	var instructions = [];
	var sequence = {};

	return {
		add: (instruction) => {
			instructions.push(instruction);
		},
		get: () => {
			return instructions;
		},
		generate: (videoSource, endTime) => {
			return {
				id: IdGenerator(),
				videoSource: videoSource,
				startTime: 0,
				endTime: endTime,
			};
		},
		updateSequence: (newInstructions) => {
			sequence.instructions = newInstructions;
			sequence.id = IdGenerator();
		},
		getSequence: () => {
			return sequence;
		}
	};
});
