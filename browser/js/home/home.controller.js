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
	            contentType:false,
	        }).done(function(data){
	        	console.log('done!');
	        });

	};

	$scope.download = function(){
		console.log('yo');
		$.ajax({
			method: 'POST',
			url:'/api/videos/download',
			beforeSend: function(jqXHR,settings){
				jqXHR.setRequestHeader("Connection", "Keep-Alive");
			},
			data:  {data:[
			{
				startTime: 2,
				endTime: 3,
				filters: ["blur"]
			},
			{
				startTime: 4,
				endTime: 6,
				filters: ["sepia"]
			},
			{
				startTime: 3,
				endTime: 4,
				filters: ["grayscale"]
			}
			]}
		}).done(function(vid){
			console.log('downloaded that shit!');
		});
	};
	
});