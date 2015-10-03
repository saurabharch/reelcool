app.config(function($stateProvider) {

    $stateProvider.state('play', {
        url: '/play',
        templateUrl: 'js/play/play.html',
        controller: 'PlayCtrl'
    });
});

app.controller('PlayCtrl', function($scope, $state, InstructionsFactory) {
    $scope.videoSource = "dragon.ogg";
    $scope.instructions = InstructionsFactory.get();
    
    function changeVideo () {
    	$scope.videoSource = "IMG_2608.MOV"; // ostrich
    	video.load();
    }

    var video;
    // We put init on the scope so that we call it with ng-init from play.html. 
    // This makes the function able to select the video element when it loads. 
    // Other methods (like document.ready) were unreliable, sometimes firing too early.
    $scope.init = function () {
        video = document.getElementById("video");
        console.log(video);
        // setTimeout(changeVideo,3000); // change video source after 3 seconds
    };

    // This is what we're considering for the instructions object. 
    // each time a user selects a new video source or changes a filter, 
    // one of these objects gets added to the list.
    // InstructionsFactory.add({
    //                     file: "dragon.ogg",
    //                     start: video.currentTime,
    //                     filter: this.value
    //                 });

});
