app.directive('sharing', () => {
    return {
        restrict: 'E',
        scope: {
            //videoSource: '=',
            //filters: '='
        },
        controller: 'ShareCtrl',
        templateUrl: 'js/sharing/sharing.html'
    };
});

app.controller('ShareCtrl', function ($http, $scope, $mdDialog, InstructionsFactory, DownloadFactory, FilterFactory) {

	$scope.socialNetworks = [
    'Download',
    // commented out Twitter to make this menu smaller for now
    // 'Twitter',
    'Facebook',
    'Instagram'
    ];

    $scope.isOpen = false;
    $scope.openDialog = function($event, item) {
      let instructions = InstructionsFactory.get();
      let audio = InstructionsFactory.getAudio();
      FilterFactory.addFiltersToAllInstructions(instructions);
      console.log(instructions);
      if (item==='Download') {
        DownloadFactory.promisifiedDownload(instructions, audio);
      }
      else {
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
    }
});
