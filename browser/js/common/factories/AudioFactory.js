app.factory("AudioFactory", function ($rootScope) {

	var audioFactory = {},
		originalTrack = {	// fake object representing the orignal audio track of the vide
			id: "original_track",
			fileName: "Original Track",
			AVsource: {
				mongoId: "original_track"
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
		$rootScope.$broadcast("audioTracks changed");
	};

	audioFactory.getAudioElements = function () {
		return tracks;
	};

	audioFactory.getAudioElementByMongoId = function (mongoId) {
		var audioElement;
		tracks.some(function (track) {
			if (track.AVsource.mongoId === mongoId) {
				audioElement = track;
				return true;
			}
		});
		return audioElement;
	};

	audioFactory.removeAudioElement = function (audioSourceId) {
		tracks.some(function (audioElement, index) {
			if (audioElement.AVsource.id === audioSourceId) {
				tracks.splice(index, 1);
				return true;
			}
		});
	};

	return audioFactory;
});
