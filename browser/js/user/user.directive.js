app.directive('user', function () {
	return {
		restrict: 'E',
		templateUrl: 'js/user/user.html',
		controller: 'UserCtrl'
	};
});

app.controller('UserCtrl', function ($scope, $state, AuthService, $window) {
	AuthService.getLoggedInUser().then( function (user) {
		$scope.user = user ? user!=="anon" : false;
	});

    $scope.logout = function () {
			console.log("user clicked logout");
        AuthService.logout()
        	.then(function () {
        		return AuthService.getLoggedInUser();
        	})
        	.then(function (authUser) {
        		$scope.user = authUser ? authUser!=="anon" : false;
						$window.location.reload();
        	});
    };

});
