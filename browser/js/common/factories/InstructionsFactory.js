app.factory('InstructionsFactory',function(){
	var instructions = [];
	function add (instruction) {
		instructions.push(instruction);
	}
	function get () {
		return instructions;
	}
	return {
		add: add, 
		get: get
	}
});