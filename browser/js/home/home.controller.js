app.controller('homeCtrl', function ($http, $scope, $rootScope, $state, VideoFactory){
	//temporarily setting instructions here to test the playground
	// $scope.instructions = [{
	// 	id: "mainplayer",
	// 	source: 'ost.ogv',
	// 	startTime: 30,
	// 	endTime: 35,
	// 	filter: 'blur'
	// }];

	$scope.toggleModal = () => {
		console.log("hoem tryna toggle")
		$rootScope.$broadcast('toggleModal');
	}

});
