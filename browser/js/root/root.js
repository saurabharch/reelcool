app.controller("RootCtrl", ($scope) => {
  $scope.modalShown = false;

  $scope.$on('toggleModal', function() {
    console.log("toggled modal");
    $scope.modalShown = !$scope.modalShown;
  });

});
