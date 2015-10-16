app.factory("RandomVideoGenerator", function (FilterFactory, InstructionsFactory) {

	var generator = {};

	let themes = [
		{
			displayName: 'Romantic',
			code: 'romantic',
			filters: 'grayscale(1)',
			audioTitle: 'closetoyou'
		},
		{
			displayName: 'Wild',
			code: 'wild',
			filters: "hue-rotate(220deg)",
			audioTitle: 'wild'
		},
		{
			displayName: 'Adventure',
			code: 'adventure',
			filters: 'sepia(1)',
			audioTitle: 'indianajones'
		},
		{
			displayName: "Happy",
			code: 'happy',
			filters: "",
			audioTitle: 'happy'
		}
	];

	generator.getThemes = () => {
		return themes;
	}

	var getRandomElement = function (array) {
		if (!array.length) {
			return;
		}
		return array[Math.round(Math.random() * (array.length - 1))];
	};


	var getRange = function (duration, cutLength) {
		var start = Math.round(Math.random() * (duration - cutLength));
		return [start, start + cutLength];
	};


	var createCuts = function (video, duration, cutsNumber, cutLength, chosenFilter) {
			var cuts = [],
			instr,
			range,
			i;

		for (i = 0; i < cutsNumber; i++) {
			instr = InstructionsFactory.generate(video.videoSource, duration, true);
			range = getRange(duration, cutLength);
			instr.startTime = range[0];
			instr.endTime = range[1];
			instr.filterString = chosenFilter || '';
			cuts.push(instr);
		}

		return cuts;
	};

	var shuffle = function (arr){
		for(var j, x, i = arr.length; i; j = Math.floor(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
		return arr;
	};


	generator.createVideo = function (videoElements, cutsNumber, cutLength, chosenFilter) {
		chosenFilter = chosenFilter;
		var allInstructions = [];
		videoElements.forEach(video => {
			var duration = document.getElementById(video.id).duration;
			var cuts = createCuts(video, duration, cutsNumber, cutLength, chosenFilter);
			allInstructions = allInstructions.concat(cuts);
		});
		shuffle(allInstructions);
		return allInstructions;
	};

	return generator;

});
