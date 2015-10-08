app.config(($stateProvider) => {

    $stateProvider.state('testplayground', {
        url: '/preview',
        templateUrl: 'js/playground/test-playground.html',
        controller: ($scope) => {
          $scope.instructions = [{
              source: 'lego.ogv',
              startTime: 0,
              endTime: 4,
              filter: 'blur'
          }, {
              source: 'ost.ogv',
              startTime: 30,
              endTime: 35,
              filter: 'bw'
          }, {
              source: 'lego.ogv',
              startTime: 2,
              endTime: 5,
              filter: 'sepia'
          }, {
              source: 'ost.ogv',
              startTime: 40,
              endTime: 45,
              filter: 'invert'
          }];

          // $scope.instructions = [
          //     {
          //         source: 'ost.ogv',
          //         startTime: 30,
          //         endTime: 35,
          //         filter: 'bw'
          //     }
          // ]

        }
    });
});
