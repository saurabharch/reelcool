app.factory("AudioFactory", function ($rootScope) {

	var audioFactory = {},
		originalTrack = {	// fake object representing the orignal audio track of the vide
			id: "original_track",
			fileName: "Original Track",
			videoSource: {},
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
		$rootScope.$broadcast("audioTracks changed");
	};

	audioFactory.getAudioElements = function () {
		return tracks;
	};


	audioFactory.removeAudioElement = function (audioSourceId) {
		tracks.some(function (audioElement, index) {
			if (audioElement.videoSource.id === audioSourceId) {
				tracks.splice(index, 1);
				return true;
			}
		});
	};



	return audioFactory;
});