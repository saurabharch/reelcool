app.factory('InstructionsFactory',function(){
	var instructions = [];

	return {
		filters: [
			{"CSSclass": "", "name":"No filter"},
			{"CSSclass": "bw", "name":"Black & White"},
			{"CSSclass": "sepia", "name":"Sepia"},
			{"CSSclass": "blur", "name":"Blur"},
			{"CSSclass": "invert", "name":"Invert"}
		],
		add: (instruction) => {
			instructions.push(instruction);
		},
		get: () => {
			return instructions
		}
	}
});
