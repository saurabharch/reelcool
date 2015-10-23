// solid factory 
app.factory('InstructionsFactory',function (IdGenerator) {
	//love the closure
	var instructions = [];
	var audio = {
			id: "original_track", // "original_track" or mongoID
			fadeOut: true
		};
	var sourceVideos = [];

	return {
		// add: (instruction) => {
		// 	instructions.push(instruction);
		// },
		// love the getter
		get: () => {
			return instructions;
		},
		getSourceVideos: () => {
			return sourceVideos;
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
