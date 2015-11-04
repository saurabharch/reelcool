describe('AVFactory', function () {
	beforeEach(module('FullstackGeneratedApp'));

    var $httpBackend;
    var $rootScope;
    
    beforeEach('Get tools', inject(function (_$httpBackend_, _$rootScope_) {
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
        
    }));

    var AVFactory;
    beforeEach('Get factories', inject(function(_AVFactory_) {
        AVFactory = _AVFactory_;
    }));

    describe('AVSource and the source objects it creates', function () {
    	var exampleSource;

    	it("is a constructor function that returns an audio or video source", function () {
    		exampleSource = new AVFactory.AVSource();
    		expect(exampleSource).to.be.an('object');
    	});

    	it("has an automatically generated id", function () {
    		expect(exampleSource.id).to.be.defined;
    	});

    	it('accepts fileName, mimeType, and arrayBuffer parameters and adds them to the source object', function () {
    		var fileName = 'exampleVideo';
    		var mimeType = 'video/webm';
    		var arrayBuffer = new ArrayBuffer(); // for our test this is just an empty buffer
    		var exampleSource2 = new AVFactory.AVSource(fileName, mimeType, arrayBuffer);
    		
    		expect(exampleSource2.fileName).to.equal(fileName);
    		expect(exampleSource2.mimeType).to.equal(mimeType);
    		expect(exampleSource2.arrayBuffer).to.equal(arrayBuffer);
    	});

    	it('has prototype methods to add a source url, associate with a mongo id, and read a local file', function () {
    		expect(exampleSource.addUrl).to.be.a('function');
    		expect(exampleSource.hasOwnProperty('addUrl')).to.be.false;

    		expect(exampleSource.addMongoId).to.be.a('function');
    		expect(exampleSource.hasOwnProperty('addMogoId')).to.be.false;

    		expect(exampleSource.startReading).to.be.a('function');
    		expect(exampleSource.hasOwnProperty('startReading')).to.be.false;

    	});

    });

	describe('AVElement and the media-containing objects that it creates', function () {
		var exampleElement;
		var exampleSource;
		var fileName = 'exampleVideo';
		var mimeType = 'video/webm';
    	var arrayBuffer = new ArrayBuffer(); // for our test this is just an empty buffer	

    	it('is a constructor function that returns an audio or video source', function () {
    		exampleElement = new AVFactory.AVElement(fileName);
    		expect(exampleElement).to.be.an('object');
    	});

    	it('has an automatically generated id', function () {
    		expect(exampleElement.id).to.be.defined;
    	});

    	it('has a fileName property passed through from the constructor', function () {
    		expect(exampleElement.fileName).to.equal(fileName);
    	});

    	it('has a sourceAttached property that is set to false by default', function (){
    		expect(exampleElement.sourceAttached).to.be.defined;
    		expect(exampleElement.sourceAttached).to.equal(false);
    	});

    	it('has a prototype method to add a source', function () {
    		expect(exampleElement.addSource).to.be.a('function');
    		expect(exampleElement.hasOwnProperty('addSource')).to.be.false;
    	});

    	it('addSource adds an AVsource and a starter set of instructions (if none are specified)', function () {
    		expect(exampleElement.AVsource).to.not.exist;
    		expect(exampleElement.instructions).to.not.exist;

    		exampleSource = new AVFactory.AVSource(fileName, mimeType, arrayBuffer);
    		exampleElement.addSource(exampleSource);

    		expect(exampleElement.AVsource).to.exist;
    		expect(exampleElement.AVsource instanceof AVFactory.AVSource).to.equal(true);

    		expect(exampleElement.instructions).to.exist;
    		expect(exampleElement.instructions).to.be.an('object');
    	});

    	it('can share an AV source across multiple AV elements', function () {
    		var exampleElement2 = new AVFactory.AVElement('exampleElement2', mimeType, arrayBuffer);
			var exampleElement3 = new AVFactory.AVElement('exampleElement3', mimeType, arrayBuffer);
			exampleElement2.addSource(exampleSource);
			exampleElement3.addSource(exampleSource);
			expect(exampleElement2.AVsource).to.equal(exampleElement3.AVsource);
    	});

	});

});