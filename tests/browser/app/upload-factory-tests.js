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

    it('should be an object', function () {
        expect(UploadFactory).to.be.an('object');
    });

    describe('methods', function () {
    	it('should have methods to upload and delete media on the server', function () {
    		expect(UploadFactory.uploadFile).to.be.a('function');
    		expect(UploadFactory.deleteFromServer).to.be.a('function');
    	});

    });

    describe('video and audio uploads', function () {
    	afterEach(function () {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

    	it('makes a POST request to the appropriate route to upload videos',function (done) {
    		var file = {contents: "stuff", type: "video/webm"};
    		var formData = new FormData();
        	formData.append("uploadedFile", file);

    		$httpBackend.expectPOST('/api/videos/upload', formData).respond(201, {});
            $httpBackend.expectGET('js/home/home.html').respond(200,{}); 

            UploadFactory.uploadFile(file).then(function () {done(); });
            $httpBackend.flush();
    	});

        it('makes a POST request to the appropriate route to upload audio',function (done) {
            var file = {contents: "stuff", type: "audio/mp3"};
            var formData = new FormData();
            formData.append("uploadedFile", file);

            $httpBackend.expectPOST('/api/audio/upload', formData).respond(201, {});
            $httpBackend.expectGET('js/home/home.html').respond(200,{}); 

            UploadFactory.uploadFile(file).then(function () {done(); });
            $httpBackend.flush(); 
        });

    });

    describe('deletion of media stored on the server', function () {

    	afterEach(function () {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

    	it('makes a DELETE request to the appropriate route to delete videos',function (done) {
    		var fakeMongoId = 'somePlaceholderMongoId';
    		var fileType = 'video/webm';

    		$httpBackend.expectDELETE('/api/videos/'+fakeMongoId).respond(200, {});
            $httpBackend.expectGET('js/home/home.html').respond(200,{}); 

            UploadFactory.deleteFromServer(fakeMongoId, fileType).then(function () {done(); });
            $httpBackend.flush();
            
    	});

        it('makes a DELETE request to the appropriate route to delete videos',function (done) {
            var fakeMongoId = 'somePlaceholderMongoId';
            var fileType = 'audio/mp3';

            $httpBackend.expectDELETE('/api/audio/'+fakeMongoId).respond(200, {});
            $httpBackend.expectGET('js/home/home.html').respond(200,{}); 

            UploadFactory.deleteFromServer(fakeMongoId, fileType).then(function () {done(); });
            $httpBackend.flush();
            
        });
    });

});