app.directive("modalDialog", () => {
  return {
    restrict: 'E',
    scope: {
      show: '='
    },
    templateUrl: 'js/common/directives/modalwindow/modalwindow.html',
    //replace: true,
    controller: ($scope, PreviewFactory, $rootScope) => {
      $scope.dialogStyle = {};

      $scope.$on('toggleModal', (e, args) => {
        //this should be the only place where "show" is toggled
        //only the modal directly affects whether it should be shown
        console.log("modal toggles itself to", args.show)
        $scope.show = args.show;
        $scope.instructions = PreviewFactory.getInstructions();
        console.log("AFTER TOGGLE: instructions in modal", $scope.instructions);
      })

      $scope.hideModal = function() {
        console.log("should hide modal.... :(")
        $rootScope.$broadcast('toggleModal', {show: false});
      };
    }
  }
})
