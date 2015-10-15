app.factory('InstructionsFactory',function (IdGenerator) {
	var instructions = [],
		audio = {
			id: "original_track", // "original_track" or mongoID
			fadeIn: false,
			fadeOut: true,
			type: undefined //"upload" or "static"
		};

	return {
		add: (instruction) => {
			instructions.push(instruction);
		},
		get: () => {
			return instructions;
		},
		generate: (videoSource, endTime, edited) => {
			return {
				id: IdGenerator(),
				videoSource: videoSource,
				startTime: 0,
				endTime: endTime,
				edited: edited || false
			};
		},
		update: (newInstructions) => instructions = newInstructions,
		makeUniqueInstructions: function(instructions){
			var instCopy = {filters:[]};
			if(instructions.filters){
				instructions.filters.forEach(function(filt,ind){
					instCopy.filters[ind]={};
					_.assign(instCopy.filters[ind], filt);
				});
			}
			for(var key in instructions){
				if(key!="filters"){
					instCopy[key]=instructions[key];
				}
			}
			return instCopy;
		},
		getAudio: function () {
			return audio;
		}
	};
});
