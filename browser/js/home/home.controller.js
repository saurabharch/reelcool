app.controller('homeCtrl', function ($http, $scope, $state, VideoFactory){
	var theFileInput = document.getElementById('fileupload');

	$scope.upload = function(){


		var file = theFileInput.files[0];
		var reader = new FileReader();

		// reader.readAsArrayBuffer(file);
		var formData = new FormData();
		formData.append("uploadedFile",file);

		$.ajax({
				method: 'POST',
				url: '/api/videos/upload',
				enctype:'multipart/form-data',
				data: formData,
				processData:false,
				contentType:false
			}).done(function(data){
				console.log('done!');
			});

	};

});