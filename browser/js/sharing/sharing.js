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

app.controller('ShareCtrl', function($scope, $mdDialog) {
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
          template: 
          	`<md-dialog>
		      <md-dialog-content>Hello User! Share your video on {{dialog.item}}!</md-dialog-content>
		      <div class="md-actions">
		        <md-button aria-label="Close dialog" ng-click="dialog.close()" class="md-primary">
		          No thanks, still playing with it.
		        </md-button>
		        <md-button aria-label="Submit dialog" ng-click="dialog.submit()" class="md-primary">
		          Yeah share it!
		        </md-button>
		      </div>
		    </md-dialog>`,
          targetEvent: $event
        });
    }
});
