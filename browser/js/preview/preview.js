app.config(($stateProvider) => {

    $stateProvider.state('preview', {
        url: '/preview',
        templateUrl: 'js/preview/preview.html',
        controller: ($scope, PreviewFactory) => {
          $scope.instructions = PreviewFactory.getInstructions();
          console.log("previewer got instructions", $scope.instructions);
        }
    });
});
