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

app.controller('ShareCtrl', function ($http, $scope, $mdDialog, InstructionsFactory) {
  function requestReelVideo (instructions) {
    return $http.post('/api/videos/makeit', instructions);
  }
  function promisifiedDownload (instructions) {
    requestReelVideo(instructions)
      .then(function (resp) {
        if (resp.status===201) {
          var url = '/api/videos/download/'+resp.data;
          // this "append" is what actually causes the video file to download to the user's computer
          $("body").append("<iframe src=" + url + " style='display: none;' ></iframe>");
        }
        else {
          console.error('The server responded with status', resp.status);
        }
      });
  }

	$scope.socialNetworks = ['Download', 'Twitter', 'Facebook', 'Instagram'];
    $scope.isOpen = false;
    $scope.openDialog = function($event, item) {
      console.log('oh hey I was clicked')
      var instructions = InstructionsFactory.get();
      if (item==='Download') {
        promisifiedDownload(instructions);
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
