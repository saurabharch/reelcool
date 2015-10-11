app.controller('PreviewController', ($scope, $mdDialog, instructions) => {
  $scope.instructions = instructions;
  $scope.closeDialog = () => {
    $mdDialog.hide();
  }
})
