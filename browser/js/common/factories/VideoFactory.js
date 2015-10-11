app.factory("VideoFactory", function($rootScope, $http, IdGenerator, AuthService, InstructionsFactory) {
    var vidFactory = {},
        videoSources = {};

    // We'll need to have the user id on hand to figure out the path to uploaded videos in the event of non-webm uploads
    var userId;
    AuthService.getLoggedInUser().then(user => userId = user ? user._id : 'anon');

    //TODO do ajax polling for uploaded videos
    //TODO sent ajax call to delete on back-end

    var VideoElement = function() {
        this.id = IdGenerator();
        this.sourceAttached = false;
    };
    VideoElement.prototype.addSource = function (videoSource, instructions) {
    	this.videoSource = videoSource;
        this.instructions = instructions || InstructionsFactory.generate(this.videoSource);
        console.log('my source was added',this.videoSource);
    };

    var VideoSource = function(fileName, mimeType, arrayBuffer) {
        this.id = IdGenerator();
        this.fileName = fileName;
        this.mimeType = mimeType;
        this.arrayBuffer = arrayBuffer;
        this.objUrls = [];
        // this.mongoId to be assigned after receiving server response
    };
    VideoSource.prototype.addUrl = function (mongoId, userId) {
    	this.url = 'api/videos/getconverted/'+userId + '/' + mongoId;
    };
    VideoSource.prototype.addMongoId = function(mongoId) {
        this.mongoId = mongoId;
        if (!this.arrayBuffer) {
        	// if no arrayBuffer, must be a converted file we've just gotten back
        	// it must need a mimeType and a URL too
        	this.addUrl(mongoId, userId); // var userId is defined early on in the controller
        	this.mimeType = "video/webm";
        }
    };
    VideoSource.prototype.startReading = function(fileName, mimeType, arrayBuffer) {
        this.fileName = fileName;
        this.mimeType = mimeType;
        this.arrayBuffer = arrayBuffer;
    };

    var uploadToServer = function(file, videoSrc) {
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
        return $http.post('/api/videos/upload', formData, options)
            .then(function(resp) {
            	// this if statement is for non-webm videos that haven't been added to the sourcevids yet
            	if (!videoSources[videoSrc.id]) videoSources[videoSrc.id] = videoSrc; 
                attachMongoId(resp.data, videoSrc.id);
                return videoSrc;
            }).catch(err => console.error('something bad happened', err));
    };

    var attachMongoId = function(mongoId, localId) {
        // Just in case, wait for videoSources[localId] to be available (per above comments).
        // It's always possible that the user has already changed their mind and deleted the
        // video from their page.
        var counter = 0;
        var incrementCounter = function() {
            counter++;
        };
        while (!videoSources[localId] && counter >= 20) {
            setTimeout(500, incrementCounter);
        }
        if (!videoSources[localId]) {
            // If videoSource still not available after 10s, give up. It could have been deleted by user.
            console.log('I could not find a videoSource to attach this mongoId to. Letting it go.');
        } else {
            videoSources[localId].addMongoId(mongoId);
        }
    };

    vidFactory.createVideoElement = function(videoSource, instructions) {
    	var newElement = new VideoElement(videoSource, instructions);
		console.log("created new video element", newElement);
		return newElement;
    };

    var addWebmVideoSource = function(file, videoSrc, reader) {
        var reader = new FileReader();
        // it's webm! we can attach it to the MediaSource right away
        return new Promise(function(resolve, reject) {
            reader.onloadend = function() {
                // once reader is ready, attach the rest of the video info
                videoSrc.startReading(file.name, file.type, reader.result);
                videoSources[videoSrc.id] = videoSrc;
                resolve(videoSrc);
            };
            reader.readAsArrayBuffer(file);
            uploadToServer(file, videoSrc);
        });
    };

    var addOtherVideoSource = function(file, videoSrc) {
        // not webm :( we'll attach it when we get it back from the server
        return uploadToServer(file, videoSrc).then(function(videoSrc) {
            videoSources[videoSrc.id] = videoSrc; // add to the video sources list
            return videoSrc;
        });
    };

    vidFactory.addVideoSource = function(file) {
        // instantiate videoSrc here, add name and contents later
        // depending on when they're actually available.
        var videoSrc = new VideoSource();
        if (file.type === "video/webm") return addWebmVideoSource(file, videoSrc);
        else return addOtherVideoSource(file, videoSrc);
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

    var attachBufferVideoSource = function(videoSource, videoElementId) {
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
            video.src = objUrl;
            video.reelCoolVideoSourceId = videoSource.id;
            videoSource.objUrls.push(objUrl);
        });
    };

    var attachUrlVideoSource = function(videoSource, videoElementId) {
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
                var xhr = new XMLHttpRequest();
                xhr.open('GET', videoSource.url, true);
                xhr.responseType = 'arraybuffer';
                xhr.onload = function(e) {
                    if (xhr.status !== 200) {
                        console.error("Failed to download video data");
                    } else {
                        var arr = new Uint8Array(xhr.response);
                        videoSource.arrayBuffer = arr;
                        try {
	                        sourceBuffer.appendBuffer(videoSource.arrayBuffer);                        	
                        }
                        catch (e) { 
                        	console.error('error appending buffer', e); 
                        	return reject(e); 
                        }
                    }
                };
                xhr.send();
            });
            var objUrl = window.URL.createObjectURL(mediaSource);
            var video = document.getElementById(videoElementId);
            video.src = objUrl;
            video.reelCoolVideoSourceId = videoSource.id;
            videoSource.objUrls.push(objUrl);
        });
    };

    vidFactory.attachVideoSource = function(videoSource, videoElementId) {
        console.log(videoSource);
        console.log(videoElementId);
        if (videoSource.arrayBuffer) {
            return attachBufferVideoSource(videoSource, videoElementId);
        }
        if (videoSource.url) {
            return attachUrlVideoSource(videoSource, videoElementId);
        }
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
