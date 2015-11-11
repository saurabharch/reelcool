describe('UploadFactory', function () {

    beforeEach(module('FullstackGeneratedApp'));

    var $httpBackend;
    var $rootScope;
    beforeEach('Get tools', inject(function (_$httpBackend_, _$rootScope_) {
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
    }));

    var UploadFactory;
    beforeEach('Get factories', inject(function (_UploadFactory_) {
        UploadFactory = _UploadFactory_;
    }));

    describe('video and audio uploads', function () {
    	afterEach(function () {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

    	it('makes a POST request to the appropriate route to upload videos',function () {
    		var file = {contents: "stuff", type: "video/webm"};
    		var formData = new FormData();
        	formData.append("uploadedFile", file);

    		$httpBackend.expectPOST('/api/videos/upload', formData).respond(201, {});
            $httpBackend.expectGET('js/home/home.html').respond(200,{}); 

            UploadFactory.uploadFile(file);
            $httpBackend.flush();
    	});

        it('makes a POST request to the appropriate route to upload audio',function () {
            var file = {contents: "stuff", type: "audio/mp3"};
            var formData = new FormData();
            formData.append("uploadedFile", file);

            $httpBackend.expectPOST('/api/audio/upload', formData).respond(201, {});
            $httpBackend.expectGET('js/home/home.html').respond(200,{}); 

            UploadFactory.uploadFile(file);
            $httpBackend.flush(); 
        });

    });

    describe('deletion of media stored on the server', function () {

    	afterEach(function () {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

    	it('makes a DELETE request to the appropriate route to delete videos',function () {
    		var fakeMongoId = 'somePlaceholderMongoId';
    		var fileType = 'video/webm';

    		$httpBackend.expectDELETE('/api/videos/'+fakeMongoId).respond(200, {});
            $httpBackend.expectGET('js/home/home.html').respond(200,{}); 

            UploadFactory.deleteFromServer(fakeMongoId, fileType);
            $httpBackend.flush();
            
    	});

        it('makes a DELETE request to the appropriate route to delete videos',function () {
            var fakeMongoId = 'somePlaceholderMongoId';
            var fileType = 'audio/mp3';

            $httpBackend.expectDELETE('/api/audio/'+fakeMongoId).respond(200, {});
            $httpBackend.expectGET('js/home/home.html').respond(200,{}); 

            UploadFactory.deleteFromServer(fakeMongoId, fileType);
            $httpBackend.flush();
            
        });
    });

});