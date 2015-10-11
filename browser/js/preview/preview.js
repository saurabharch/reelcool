app.config(($stateProvider) => {

    $stateProvider.state('preview', {
        url: '/preview',
        templateUrl: 'js/preview/preview-dialog.html',
        controller: ($scope, PreviewFactory) => {
          $scope.instructions = PreviewFactory.getInstructions();
          console.log("previewer got instructions", $scope.instructions);
        }
    });
});

app.controller('PreviewController', ($scope, $mdDialog, instructions) => {
  $scope.instructions = instructions;
  $scope.closeDialog = () => {
    $mdDialog.hide();
  }
})
