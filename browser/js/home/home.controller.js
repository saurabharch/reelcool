app.controller('homeCtrl', function ($http, $scope, $state, VideoFactory){
	var theFileInput = document.getElementById('fileupload');

    console.log(theFileInput);
	$scope.upload = function(){


	    var file = theFileInput.files[0];
	    var reader = new FileReader();

	    reader.readAsDataURL(file);

	    reader.onloadend = function () {
	        console.log('hey');
	        $.ajax({
	            method: 'POST',
	            url: '/api/videos/upload',
	            data: {
	                name: file.name
	            }
	        });
	    };
	};

	$scope.instructions = {
		
	};

});
