app.config(function ($stateProvider) {

    $stateProvider.state('play', {
        url: '/play/:source',
        templateUrl: 'js/play/play.html',
        controller: 'PlayCtrl'
    });
});

app.controller('PlayCtrl', function ($scope, $state, $stateParams) {
  $scope.source = $stateParams.source;
});
