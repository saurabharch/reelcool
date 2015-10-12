app.controller("RootCtrl", ($scope) => {
  $scope.modalShown = false;

  $scope.$on('toggleModal', (e, shown) => {
    $scope.modalShown = !$scope.modalShown;
  });
});
