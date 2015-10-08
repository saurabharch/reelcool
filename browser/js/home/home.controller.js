app.controller('homeCtrl', function ($http, $scope, $state, VideoFactory){
	//temporarily setting instructions here to test the playground
	$scope.instructions = [{
		source: 'lego.ogv',
		startTime: 0,
		endTime: 5,
		filters: []
	}];

});
