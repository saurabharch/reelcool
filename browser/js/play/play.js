app.config(function($stateProvider) {

    $stateProvider.state('play', {
        url: '/play',
        templateUrl: 'js/play/play.html',
        controller: 'PlayCtrl'
    });
});

app.controller('PlayCtrl', function($scope, $state, $stateParams) {
    $scope.source = $stateParams.source;
    angular.element(document).ready(init);  // calls init from video-effects-demo.js
});
