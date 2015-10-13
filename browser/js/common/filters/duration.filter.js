app.filter("duration", function () {
	return function (durationInSec) {
		if (!durationInSec) {
			return "-:-";
		}
		var min = Math.floor(Number(durationInSec) / 60);
		var sec = Math.round(Number(durationInSec)) % 60;
		sec = sec < 10 ? "0" + sec : sec;
		return min + ":" + sec;
	};
});