app.factory("AudioFactory", function () {

	var audioFactory = {},
		tracks = [];

	audioFactory.setAudioElement = function (audioElement) {
		return tracks.push(audioElement);
	};

	audioFactory.getAudioElements = function () {
		return tracks;
	};

	return audioFactory;
});