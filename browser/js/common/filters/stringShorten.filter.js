app.filter("shorten", function () {
	return function (value) {
		try {
			if (value.length>9) {
				return value.slice(0,9)+"...";
			}
			else{
				return value;
			}
		}
		catch (e){
			return value;
		}
	};
});