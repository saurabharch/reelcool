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
    // var video = document.getElementById("video");
    // console.log(video);
    
    function changeVideo () {
    	$scope.videoSource = "IMG_2608.MOV"; // ostrich
    	video.load();
    }

    // Still need to find a document.ready-type way to initialize this without setTimeout
    // the document.ready method sometimes fires too early
    // angular.element(document).ready(init); 
    setTimeout(init,2000);

    var video;

    function init(event) {
        video = document.getElementById("video");
        console.log(video);
        // setTimeout(changeVideo,3000); // change video source after 3 seconds
    }

    // This is what we're considering for the instructions object. 
    // each time a user selects a new video source or changes a filter, 
    // one of these objects gets added to the list.
    // InstructionsFactory.add({
    //                     file: "dragon.ogg",
    //                     start: video.currentTime,
    //                     filter: this.value
    //                 });

});
