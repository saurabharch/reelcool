app.factory("VideoFactory", function($rootScope, IdGenerator) {

    var vidFactory = {},
        videoSources = {};

    //TODO do ajax polling for uplodaed videos
    //TODO sent ajax call to delete on back-end

    var VideoElement = function(videoSource) {
        this.id = IdGenerator();
        this.sourceAttached = false;
        this.videoSource = videoSource;
    };

    var VideoSource = function(fileName, mimeType, arrayBuffer) {
        this.id = IdGenerator();
        this.fileName = fileName;
        this.mimeType = mimeType;
        this.arrayBuffer = arrayBuffer;
        this.objUrls = [];
        // this.mongoId to be assigned after receiving server response
    };
    VideoSource.prototype.startReading = function(fileName, mimeType, arrayBuffer) {
        this.fileName = fileName;
        this.mimeType = mimeType;
        this.arrayBuffer = arrayBuffer;
    };
    VideoSource.prototype.addMongoId = function (mongoId) {
    	this.mongoId = mongoId;
    };

    var uploadVideoToServer = function(file, localId) {
        // videoSources[localId] won't be immediately available because the 
        // request to the server goes out without waiting for the video data 
        // to get attached to its MediaSource. But it should be ready by the time
        // this ajax request completes, so we use it in the done function.
        var reader = new FileReader();
        var formData = new FormData();
        formData.append("uploadedFile", file);
        $.ajax({
            method: 'POST',
            url: '/api/videos/upload',
            enctype: 'multipart/form-data',
            data: formData,
            processData: false,
            contentType: false
        }).done(function(mongoId) {
            // Just in case, wait for videoSources[localId] to be available (per above comments).
            // It's always possible that the user has already changed their mind and deleted the
            // video from their page.
            var counter = 0;
            var incrementCounter = function () {counter++; };
            while (!videoSources[localId] && counter>=20) {
            	setTimeout(500, incrementCounter); 
            }
            if (!videoSources[localId]) {
            	// If videoSource still not available after 10s, give up. It could have been deleted by user.
            	console.log('I could not find a videoSource to attach this mongoId to. Letting it go.');
            }
            else {
            	videoSources[localId].addMongoId(mongoId);
            	console.log('videoSource obj', videoSources[localId]);
            }
        }).fail(function (resp) {
        	console.log('Failed to upload. Server responded with status',resp.status);
        });
    };

    vidFactory.createVideoElement = function(videoSource) {
        return new VideoElement(videoSource);
    };

    vidFactory.addVideoSource = function(file) {
        return new Promise(function(resolve, reject) {
            var reader = new FileReader();
            // instantiate videoSrc without name, type, or buffer
            // this way we'll have the id available rightaway
            var videoSrc = new VideoSource();
            reader.onloadend = function() {
                // once reader is ready, attach the rest of the video info
                videoSrc.startReading(file.name, file.type, reader.result);
                videoSources[videoSrc.id] = videoSrc;
                resolve(videoSrc);
            };
            reader.readAsArrayBuffer(file);
            uploadVideoToServer(file, videoSrc.id);
        });
    };

    var mimeTypes = {
        //'video/mp4': 'video/mp4; codecs="avc1.64001F, mp4a.40.2"',
        //'video/mp4': 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
        //'video/mp4':  'video/mp4; codecs="avc1.58A01E, mp4a.40.2"',
        //'video/mp4':  'video/mp4; codecs="avc1.4D401E, mp4a.40.2"',
        //'video/mp4':  'video/mp4; codecs="avc1.64001E, mp4a.40.2"',
        //'video/mp4':  'video/mp4; codecs="mp4v.20.8, mp4a.40.2"',
        //'video/mp4':  'video/mp4; codecs="mp4v.20.240, mp4a.40.2"',
        'video/webm': 'video/webm; codecs="vp8, vorbis"'
    };


    vidFactory.attachVideoSource = function(videoSource, videoElementId) {
        return new Promise(function(resolve, reject) {
            var mediaSource = new MediaSource();
            mediaSource.addEventListener("sourceopen", function() {
                var sourceBuffer = mediaSource.addSourceBuffer(mimeTypes[videoSource.mimeType]);
                sourceBuffer.addEventListener('updateend', function(_) {
                    try {
                        mediaSource.endOfStream();
                        resolve();
                    } catch (error) {
                        return reject(error);
                    }
                });
                try {
                    sourceBuffer.appendBuffer(videoSource.arrayBuffer);
                } catch (error) {
                    return reject(error);
                }
            });
            var objUrl = window.URL.createObjectURL(mediaSource);
            var video = document.getElementById(videoElementId);
            // console.log("videoElementId", videoElementId);
            video.src = objUrl;
            video.reelCoolVideoSourceId = videoSource.id;
            videoSource.objUrls.push(objUrl);
        });
    };


    vidFactory.deleteVideoSource = function(videoSourceId) {
        var videoSource = videoSources[videoSourceId];

        $rootScope.$broadcast("videosource-deleted", videoSourceId);

        videoSource.objUrls.forEach(window.URL.revokeObjectURL);
        delete videoSource.arrayBuffer;

        //TODO sent ajax call to delete on back-end

        console.log("video source terminated!");
    };

    return vidFactory;

});
