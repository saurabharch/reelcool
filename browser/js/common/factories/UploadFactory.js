app.factory('UploadFactory', function ($http) {

	var apiPathByFileType = function(type) {
        if (type.indexOf("video") === -1) return "/api/audio";
        else return "/api/videos";
    };

    var uploadFile = function(file) {
    	var uploadPath = apiPathByFileType(file.type) + "/upload";
        var formData = new FormData();
        formData.append("uploadedFile", file);
        var options = {
            withCredentials: false,
            // We set Content-Type to undefined because that way the browser automatically fills in 'multipart/form-data'.
            // If we manually set it to 'multipart/form-data', it will error because it expects to be told the boundary.
            headers: {
                'Content-Type': undefined
            },
            // The line below overrides Angular's default transformRequest function,
            // which would try to serialize our form data. We want it left intact.
            transformRequest: angular.identity
        };
        return $http.post(uploadPath, formData, options);
    };
    

    var deleteFromServer = function(mongoId, fileType) {
        var apiPath = apiPathByFileType(fileType);
        return $http.delete(apiPath + '/' + mongoId)
        	.then(function(resp) {
            	if (resp.status === 200) console.log('Successfully deleted', resp.data._id);
            	else console.error('Server responded with ', resp.status); // should be 404 if video was not found
        	});
    };

    return {
    	uploadFile: uploadFile,
    	deleteFromServer: deleteFromServer
    };

});
