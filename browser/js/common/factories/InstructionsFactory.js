app.factory('InstructionsFactory',function(IdGenerator){
	var instructions = [];

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
				filters: []
			};
		}
	};
});
