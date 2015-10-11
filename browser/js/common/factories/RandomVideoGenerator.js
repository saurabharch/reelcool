app.factory("RandomVideoGenerator", function (FilterFactory, InstructionsFactory) {

	var generator = {};


	var getRandomElement = function (array) {
		if (!array.length) {
			return;
		}
		return array[Math.round(Math.random() * (array.length - 1))];
	};

	//TODO get from FilterFactory
	var filters = ["invert", "blur", "bw", "sepia"];


	var getRange = function (duration, cutLength) {
		var start = Math.round(Math.random() * (duration - cutLength));
		return [start, start + cutLength];
	};


	var createCuts = function (video, duration, cutsNumber, cutLength) {
			var cuts = [],
			instr,
			range,
			i;

		for (i = 0; i < cutsNumber; i++) {
			instr = InstructionsFactory.generate(video.videoSource, duration);
			range = getRange(duration, cutLength);
			instr.startTime = range[0];
			instr.endTime = range[1];
			instr.filter = getRandomElement(filters);
			cuts.push(instr);
		}

		return cuts;
	};

	var shuffle = function (arr){
		for(var j, x, i = arr.length; i; j = Math.floor(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
		return arr;
	};


	generator.createVideo = function (videoElements, cutsNumber, cutLength) {
		console.log(videoElements);
		console.log(cutsNumber);
		console.log(cutLength);
		var allInstructions = [];
		videoElements.forEach(video => {
			var duration = document.getElementById(video.id).duration;
			var cuts = createCuts(video, duration, cutsNumber, cutLength);
			allInstructions = allInstructions.concat(cuts);
		});
		shuffle(allInstructions);
		return allInstructions;
	};


	return generator;

});


