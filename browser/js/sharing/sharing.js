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
  function download () {
    $.ajax({
      method: 'POST',
      url:'/api/videos/makeit',
      data:  {data:[
      {
        startTime: 2,
        endTime: 3,
        filters: ["blur"]
      },
      {
        startTime: 4,
        endTime: 6,
        filters: ["sepia"]
      },
      {
        startTime: 3,
        endTime: 4,
        filters: ["grayscale"]
      }
      ]}
    }).done(function(vid){
      var src = '/api/videos/download/' + vid;
      $("body").append("<iframe src=" + src + " style='display: none;' ></iframe>");
    });
  };

	$scope.socialNetworks = ['Download', 'Twitter', 'Facebook', 'Instagram'];
    $scope.isOpen = false;
    $scope.openDialog = function($event, item) {
      if (item==='Download') download();
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
