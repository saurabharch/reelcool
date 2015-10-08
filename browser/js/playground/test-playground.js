app.config(($stateProvider) => {

    $stateProvider.state('testplayground', {
        url: '/test',
        templateUrl: 'js/playground/test-playground.html',
        controller: ($scope) => {
          $scope.instructions = [{
              source: 'lego.ogv',
              startTime: 0,
              endTime: 4,
              filter: 'blur'
          }, {
              source: 'IMG_2608.MOV',
              startTime: 30,
              endTime: 35,
              filter: 'bw'
          }, {
              source: 'lego.ogv',
              startTime: 2,
              endTime: 5,
              filter: 'sepia'
          }, {
              source: 'IMG_2608.MOV',
              startTime: 40,
              endTime: 45,
              filter: 'invert'
          }];

        }
    });
});
