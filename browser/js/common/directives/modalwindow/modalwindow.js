app.directive("modalDialog", () => {
  return {
    restrict: 'E',
    scope: {
      show: '='
    },
    templateUrl: 'js/common/directives/modalwindow/modalwindow.html',
    //replace: true,
    controller: ($scope, PreviewFactory) => {
      $scope.dialogStyle = {};

      $scope.cat = "cat";

      $scope.$on('toggleModal', () => {
        $scope.instructions = PreviewFactory.getInstructions();
        console.log("AFTER TOGGLE: instructions in modal", $scope.instructions);
      })

      // if (attrs.width){
      //   $scope.dialogStyle.width = attrs.width;
      // }
      // if (attrs.height){
      //   $scope.dialogStyle.height = attrs.height;
      // }

      $scope.hideModal = function() {
        $scope.show = false;
      };
    }
  }
})
