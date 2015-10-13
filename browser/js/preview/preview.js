app.config(($stateProvider) => {

    $stateProvider.state('preview', {
        url: '/preview',
        templateUrl: 'js/preview/preview.html',
        controller: ($scope) => {
          $scope.instructions = InstructionsFactory.get();
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
