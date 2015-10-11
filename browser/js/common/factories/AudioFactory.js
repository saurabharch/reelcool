app.factory("AudioFactory", function () {

	var audioFactory = {},
		originalTrack = {	// fake object representing the orignal audio track of the vide
			id: "original_track",
			videoSource: {
				fileName: "Original track"
			},
			domElement: {
				play: function () {},
				pause: function () {}
			}
		},
		tracks = [originalTrack];

	audioFactory.getOriginalAudio = function () {
		return originalTrack;
	};

	audioFactory.setAudioElement = function (audioElement) {
		tracks.push(audioElement);
	};

	audioFactory.getAudioElements = function () {
		return tracks;
	};

	return audioFactory;
});