describe('DownloadFactory', function() {
    beforeEach(module('FullstackGeneratedApp'));

    var $httpBackend;
    var $rootScope;
    
    beforeEach('Get tools', inject(function (_$httpBackend_, _$rootScope_) {
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
    }));

    var DownloadFactory;
    beforeEach('Get factories', inject(function(_DownloadFactory_) {
        DownloadFactory = _DownloadFactory_;
    }));

    it('should be an object', function() {
        expect(DownloadFactory).to.be.an('object');
    });

    describe('methods', function() {
        it('should have methods to upload and delete media on the server', function() {
            expect(DownloadFactory.getUserMedia).to.be.a('function');
            expect(DownloadFactory.getThemeAudio).to.be.a('function');
            expect(DownloadFactory.createReelVideo).to.be.a('function');
        });
    });

    describe("getUserMedia fetches a user's saved media so that it can be automatically loaded on the page", function() {
        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it("makes a GET request to the appropriate route to get the user's uploaded videos", function () {
            var type = "videos";
            var userId = "somePlaceholderUserMongoId";

            $httpBackend.expectGET("/api/videos/byuser/" + userId).respond(200, {});
            $httpBackend.expectGET('js/home/home.html').respond(200, {});

            DownloadFactory.getUserMedia(type, userId);
            $httpBackend.flush();
        });

        it("makes a GET request to the appropriate route to get the user's uploaded audio", function () {
            var type = "audio";
            var userId = "somePlaceholderUserMongoId";

            $httpBackend.expectGET("/api/audio/byuser/" + userId).respond(200, {});
            $httpBackend.expectGET('js/home/home.html').respond(200, {});

            DownloadFactory.getUserMedia(type, userId);
            $httpBackend.flush();
        });
    });

    describe("getThemeAudio retrieves information about common audio files that are made available to all users", function() {
        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it("makes a GET request to the correct route", function () {
            $httpBackend.expectGET("/api/audio/themes").respond(200, {});
            $httpBackend.expectGET('js/home/home.html').respond(200, {});

            DownloadFactory.getThemeAudio();

            $httpBackend.flush();
            
        });
    });

    describe("requestReelVideo sends instructions to the server so it can encode a real mp4 file", function() {
        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it("makes a POST request to the correct route", function () {
            // dummy data for payload
            var instructions = {};
            var audio = {};
            var payload = {instructions: instructions, audio: audio};

            $httpBackend.expectPOST("/api/videos/makeit", payload).respond(201, {});
            $httpBackend.expectGET('js/home/home.html').respond(200, {});

            DownloadFactory.requestReelVideo(instructions, audio);

            $httpBackend.flush();
            
        });
    });

});
