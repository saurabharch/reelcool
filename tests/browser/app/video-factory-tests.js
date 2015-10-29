describe('VideoFactory', function () {

    beforeEach(module('FullstackGeneratedApp'));

    var $httpBackend;
    var $rootScope;
    beforeEach('Get tools', inject(function (_$httpBackend_, _$rootScope_) {
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
    }));

    var VideoFactory;
    beforeEach('Get factories', inject(function (_VideoFactory_) {
        VideoFactory = _VideoFactory_;
    }));

    it('should be an object', function () {
        expect(VideoFactory).to.be.an('object');
    });

    describe('methods', function () {
    	it('should have methods to manage video elements and their sources', function () {
    		expect(VideoFactory.createVideoElement).to.be.a('function');
    		expect(VideoFactory.addRemoteSource).to.be.a('function');
    		expect(VideoFactory.addVideoSource).to.be.a('function');
    		expect(VideoFactory.attachVideoSource).to.be.a('function');
    		expect(VideoFactory.deleteVideoSource).to.be.a('function');
    		expect(VideoFactory.getPrevUploads).to.be.a('function');
    	});

    });

    describe('video uploads', function () {
    	afterEach(function () {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

    	it('makes a POST request to upload videos',function (done) {
    		var file = {contents: "stuff", type: "video/webm"};
    		var formData = new FormData();
        	formData.append("uploadedFile", file);

    		//$httpBackend.expectGET('/session').respond(200,{});
            $httpBackend.expectPOST('/api/videos/upload', formData).respond(201, {});
            //$httpBackend.expectGET('js/home/home.html').respond(200,{});

            VideoFactory.addVideoSource(file).then(function () {done(); });
            //done();
            $httpBackend.flush();
            
    	});
    });

});