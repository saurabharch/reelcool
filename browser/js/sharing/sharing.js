app.directive('sharing', () => {
    return {
        restrict: 'E',
        scope: {
            //videoSource: '=',
            //filters: '='
        },
        controller: 'ShareCtrl',
        templateUrl: 'js/sharing/sharing.html'
    }
});

app.controller('ShareCtrl', function ($scope, $mdDialog) {
	$scope.socialNetworks = ['Twitter', 'Facebook', 'Instagram'];
    $scope.isOpen = false;
    $scope.openDialog = function($event, item) {
        // Show the dialog
        $mdDialog.show({
          clickOutsideToClose: true,
          controller: function($mdDialog) {
            // Save the clicked item
            this.item = item;
            // Setup some handlers
            this.close = function() {
              $mdDialog.cancel();
            };
            this.submit = function() {
              $mdDialog.hide();
            };
          },
          controllerAs: 'dialog',
          templateUrl: "js/common/directives/dialog/dialog.html",
          targetEvent: $event
        });
    }
});
