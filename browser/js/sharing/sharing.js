app.directive('sharing', () => {
    return {
        restrict: 'E',
        scope: {
            //videoSource: '=',
            //filters: '='
        },
        controller: 'ShareCtrl',
        templateUrl: 'js/sharing/sharing.html'
    };
});

app.controller('ShareCtrl', function ($http, $scope, $mdDialog, InstructionsFactory, DownloadFactory, FilterFactory) {

	$scope.socialNetworks = [
    'Download',
    // commented out Twitter to make this menu smaller for now
    // 'Twitter',
    'Facebook',
    'Instagram'
    ];

    $scope.requestDownload = () => {
      let instructions = InstructionsFactory.get();
      let audio = InstructionsFactory.getAudio();
      FilterFactory.addFiltersToAllInstructions(instructions);
      DownloadFactory.createReelVideo(instructions, audio);
    };
});
