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

});