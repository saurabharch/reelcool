app.controller('homeCtrl', function ($http, $scope, $mdMedia){

	$scope.desktopScreen = $mdMedia("(min-width: 1025px)");
	$scope.mobileScreen = $mdMedia("(max-width: 1024px)");



});
