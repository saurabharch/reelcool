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
    	it('should have methods to manage video elements and their sources', function () {
    		expect(UploadFactory.uploadFile).to.be.a('function');
    		expect(UploadFactory.deleteFromServer).to.be.a('function');
    		expect(UploadFactory.getUserMedia).to.be.a('function');
    		expect(UploadFactory.getThemeAudio).to.be.a('function');
    	});

    });

    describe('video uploads', function () {
    	afterEach(function () {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

    	it('makes a POST request to the appropriate route to upload videos',function (done) {
    		var file = {contents: "stuff", type: "video/webm"};
    		var formData = new FormData();
        	formData.append("uploadedFile", file);

    		$httpBackend.expectPOST('/api/videos/upload', formData).respond(201, {});
            $httpBackend.expectGET('js/home/home.html').respond(200,{}); // first request always loads the main page

            UploadFactory.uploadFile(file).then(function () {done(); });
            $httpBackend.flush();
            
    	});
    });

    describe('video deletion', function () {
    	afterEach(function () {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

    	it('makes a DELETE request to the appropriate route to delete videos',function (done) {
    		var fakeMongoId = 't9384yntv3not3023y';
    		var fileType = 'video/webm'; //'audio/mp3'

    		$httpBackend.expectDELETE('/api/videos/'+fakeMongoId).respond(200, {});
            $httpBackend.expectGET('js/home/home.html').respond(200,{}); // first request always loads the main page

            UploadFactory.deleteFromServer(fakeMongoId, fileType).then(function () {done(); });
            $httpBackend.flush();
            
    	});
    });

});