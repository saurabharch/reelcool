app.config(function($stateProvider) {

    $stateProvider.state('play', {
        url: '/play',
        templateUrl: 'js/play/play.html',
        controller: 'PlayCtrl'
    });
});

app.controller('PlayCtrl', function($scope, $state, $stateParams, InstructionsFactory) {
    //$scope.source = $stateParams.source;
    console.log("video", document.getElementById("video"));
    $scope.videoSource = "dragon.ogg";
    $scope.instructions = InstructionsFactory.get();
    //angular.element(document).ready(init);
    setTimeout(init,2000);

    var fg;
    var video;
    var canvas;

    function init(event) {
        video = document.getElementById("video");
        canvas = document.getElementById("canvas");
        console.log(canvas);
        fg = new frameGrabber(video, canvas);
        displayEffects();
        // setTimeout(changeVideo,3000); // change video source after 3 seconds
    }

    function displayEffects() {
        var effectsBlock = document.getElementById("effects");
        var ul = document.createElement("ul");
        for (var effect in JSManipulate) {
            var li = document.createElement("li");
            var input = document.createElement("input");
            input.type = "radio"
            input.name = "effects"
            input.value = effect;
            input.id = effect;
            input.addEventListener("click",
                function(evt) {
                    fg.setEffect(this.value);
                    InstructionsFactory.add({
                    	file: "dragon.ogg",
                    	start: video.currentTime,
                    	filter: this.value
                    });
                    console.log($scope.instructions);
                },
                false);
            li.appendChild(input);
            var label = document.createElement("label");
            label.innerHTML = JSManipulate[effect].name;
            label.setAttribute("for", input.id);
            li.appendChild(label);
            ul.appendChild(li);
        }
        effectsBlock.appendChild(ul);
        effectsBlock.getElementsByTagName('input')[0].checked = true;
    }

    function changeVideo () {
    	$scope.videoSource = "IMG_2608.MOV"; // ostrich
    	video.load();
    }

});
