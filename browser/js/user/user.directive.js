app.directive('user', function () {
	return {
		restrict: 'E', 
		templateUrl: 'js/user/user.html', 
		controller: 'UserCtrl'
	};
});

app.controller('UserCtrl', function ($scope, $mdDialog, $state, AuthService) {
	AuthService.getLoggedInUser().then( function (user) {
		$scope.user = user ? user!=="anon" : false;
	});

	$scope.openDialog = function ($event) {
        $mdDialog.show({
          clickOutsideToClose: true,
          controller: function($mdDialog) {
            // Setup some handlers
            this.close = function() {
              $mdDialog.cancel();
            };
            this.submit = function() {
              $mdDialog.hide();
            };
          },
          controllerAs: 'dialog',
          templateUrl: "js/login/login.html",
          targetEvent: $event
        });
    };
    $scope.openLogoutDialog = function ($event, user) {
        $mdDialog.show({
          clickOutsideToClose: true,
          controller: function($mdDialog, $scope, $rootScope, $state) {
            // Setup some handlers
            this.close = function() {
              $mdDialog.cancel();
            };
            this.submit = function() {
              $mdDialog.hide();
            };
            $scope.logout = function () {
                AuthService.logout()
                	.then(function () {
                		return AuthService.getLoggedInUser();
                	})
                	.then(function (authUser) {
                		user = authUser ? authUser!=="anon" : false;
                		$mdDialog.hide();
                	});
            };
          },
          controllerAs: 'dialog',
          template: `<div class="oauth"><md-button class="md-raised md-warn" ng-click="logout()">Logout</md-button></div>`,
          targetEvent: $event
        });
    };
});