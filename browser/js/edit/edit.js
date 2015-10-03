app.config(function($stateProvider) {

    $stateProvider.state('edit', {
        url: '/edit',
        templateUrl: 'js/edit/edit.html',
        controller: 'EditCtrl'
    });
});

app.controller('EditCtrl', function($scope, $state, InstructionsFactory) {
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
    

    // Stuff related to filters and filter actions here
    $scope.filters = [
        {"CSSclass": "", "name":"No filter"}, 
        {"CSSclass": "bw", "name":"Black and White"}, 
        {"CSSclass": "sepia", "name":"Sepia"}, 
        {"CSSclass": "blur", "name":"Blur"}, 
        {"CSSclass": "invert", "name":"Invert"}
    ]; // maybe these should be an app.value instead?
    $scope.currentFilter = $scope.filters[0].CSSclass;
    $scope.changeFilter = function (filter) {
        $scope.currentFilter = filter;
        // below, a test implementation of how filter changes might be pushed to the instructions list
        InstructionsFactory.add({
                        file: "dragon.ogg",
                        start: video.currentTime,
                        filter: filter
                    });
        console.log($scope.instructions);
    };
});
