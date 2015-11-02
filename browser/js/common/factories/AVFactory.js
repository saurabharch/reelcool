app.factory('AVFactory', function (IdGenerator, InstructionsFactory) {
	// Formerly called VideoSource, but actually 
	// used for both audio and video, hence AVSource
	var AVSource = function (fileName, mimeType, arrayBuffer) {
        this.id = IdGenerator();
        this.fileName = fileName;
        this.mimeType = mimeType;
        this.arrayBuffer = arrayBuffer;
        this.objUrls = [];
        // this.mongoId to be assigned after receiving server response
    };
    AVSource.prototype.addUrl = function (mongoId, userId) {
        var media = (this.mimeType &&
            this.mimeType.indexOf("video") === -1) ? "audio" : "videos";
        this.url = 'api/' + media + '/getconverted/' + userId + '/' + mongoId;
    };
    AVSource.prototype.addMongoId = function (mongoId) {
        this.mongoId = mongoId;
        if (!this.arrayBuffer) {
            // if no arrayBuffer, must be a converted file we've just gotten back
            // it must need a mimeType and a URL too
            this.mimeType = "video/webm";
            this.addUrl(mongoId, userId); // var userId is defined early on in the controller
        }
    };
    AVSource.prototype.startReading = function (fileName, mimeType, arrayBuffer) {
        this.fileName = fileName;
        this.mimeType = mimeType;
        this.arrayBuffer = arrayBuffer;
    };

	// Formerly known as VideoElement, but actually
	// used for both audio or video, hence AVElement
	var AVElement = function (fileName) {
        this.id = IdGenerator();
        this.fileName = fileName;
        this.sourceAttached = false;
    };
    AVElement.prototype.addSource = function(AVsource, instructions) {
        this.AVsource = AVsource; // not calling it a MediaSource to avoid confusion with HTML MediaSource
        this.instructions = instructions || InstructionsFactory.generate(this.AVsource);
    };

    return {
    	AVSource: AVSource, 
    	AVElement: AVElement
    };
    
});