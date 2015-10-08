app.controller('homeCtrl', function ($http, $scope, $state, VideoFactory){
	//temporarily setting instructions here to test the playground
	$scope.instructions = [{
		source: 'ost.ogv',
		startTime: 30,
		endTime: 35,
		filter: 'blur'
	}];

});
