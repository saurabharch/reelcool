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
    $scope.currentTime = 0;
    var video = document.getElementById("video1");
    

    video.onplaying = function(){
        $scope.endTime=video.duration;
        console.dir(video);
        console.log($scope.endTime);
        $scope.$digest();
        var pointer = document.getElementsByClassName('rz-pointer')[0];
        pointer.onmousedown = function(){
            video.pause();
            document.onclick = function(){
                video.currentTime=Number(document.getElementsByClassName('rz-bubble')[2].innerHTML);
                video.play();
                document.onclick = null;
            };
            
        };
        
    };
    video.ontimeupdate = function(){
        $scope.currentTime=video.currentTime;
        $scope.$digest();
    };

    // video.load();
    // video.play();
    // $scope.endTime = video.duration;
    // console.dir(video);
    // console.log($scope.endTime)


    function changeVideo () {
        $scope.videoSource = "IMG_2608.MOV"; // ostrich
        $scope.$digest();
        console.dir(video);
        video.load();
    }
    // We put init on the scope so that we call it with ng-init from play.html. 
    // This makes the function able to select the video element when it loads. 
    // Other methods (like document.ready) were unreliable, sometimes firing too early.


    // video.ontimeupdate = function(){
    //     console.log('thiscurrentTime', this.currentTime)
    //     console.log('vidtime', video.currentTime)
    //     $scope.currentTime=this.currentTime;
    //     $scope.$digest();
    // };
    // setTimeout(changeVideo,5000); // change video source after 3 seconds

    // This is what we're considering for the instructions object. 
    // each time a user selects a new video source or changes a filter, 
    // one of these objects gets added to the list.
    // InstructionsFactory.add({
    //                     file: "dragon.ogg",
    //                     start: video.currentTime,
    //                     filter: this.value
    //                 });

});
