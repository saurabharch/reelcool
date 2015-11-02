app.factory("VideoFactory", function ($rootScope, $mdToast, AuthService, UploadFactory, DownloadFactory, AVFactory) {

    var vidFactory = {},
        videoSources = {};

    // We'll need to have the user id on hand to figure out the path to uploaded videos in the event of non-webm uploads
    var userId;
    AuthService.getLoggedInUser().then(user => userId = user ? user._id : 'anon');

    var uploadToServer = function(file, videoSrc) {
        return UploadFactory.uploadFile(file)
            .then(function(resp) {
                // this if statement is for non-webm videos that haven't been added to the sourcevids yet
                if (!videoSources[videoSrc.id]) {
                    videoSources[videoSrc.id] = videoSrc;
                }
                attachMongoId(resp.data, videoSrc.id); // where resp.data is the mongoId of the newly uploaded video
                return videoSrc;
            })
            .catch(err => console.error('something bad happened', err));
    };

    // This is the new way we upload non-webm files that will need to be converted
    // We will not create a video source for them in anticipation of their conversion
    // Instead we will let the long-polling discover them when they are ready.
    vidFactory.uploadUnattached = function(file) {
        var toast1 = $mdToast.simple().content(`Uploading ${file.name}.`);
        var uploadSuccess = $mdToast.simple().content('Your video will be back when it has been converted.').hideDelay(3000);
        var uploadFail = $mdToast.simple().content(`${file.name} failed to upload. Please try again later.`).hideDelay(3000);
        return $mdToast.show(toast1)
            .then(() => UploadFactory.uploadFile(file)
            .then(
                (resp) => {
                    if (resp.status === 201) $mdToast.show(uploadSuccess);
                    else $mdToast.show(uploadFail);
                }, 
                () => $mdToast.show(uploadFail)
            ));
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
        if (videoSources[localId]) {
            videoSources[localId].addMongoId(mongoId);
        } else {
            // If videoSource still not available after 10s, figure it must have been deleted locally by user.
            console.log('I could not find a videoSource to attach this mongoId to. Deleting from server.');
            UploadFactory.deleteFromServer(mongoId);
        }
    };

    vidFactory.addRemoteSource = function(mongoId, isAudio, isTheme) {
        return new Promise(function(resolve, reject) {
            var videoSrc = new AVFactory.AVSource();
            videoSrc.mongoId = mongoId;
            videoSrc.mimeType = isAudio ? "audio/mp3" : "video/webm";
            videoSrc.isTheme = isTheme;
            if (isTheme) {
                videoSrc.url = `/api/audio/themes/${mongoId}`;
            } else {
                videoSrc.addUrl(mongoId, userId);
            }
            videoSources[videoSrc.id] = videoSrc;
            resolve(videoSrc);
        });
    };

    var addWebmVideoSource = function(file, videoSrc, reader) {
        var reader = new FileReader();
        // it's webm! we can attach it to the MediaSource right away
        return new Promise(function(resolve, reject) {
            //modularize events
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
        var videoSrc = new AVFactory.AVSource();
        if (mimeTypes[file.type]) return addWebmVideoSource(file, videoSrc);
        else return addOtherVideoSource(file, videoSrc);
    };

    var mimeTypes = {
        'audio/mp3': 'audio/mpeg',
        'video/webm': 'video/webm; codecs="vp8, vorbis"'
    };

    var attachBufferVideoSource = function(videoSource, videoElementId) {
        return new Promise(function(resolve, reject) {
            var mediaSource = new MediaSource();
            // modularize events
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
            // modularize events
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
                // mod events
                xhr.onload = function(e) {
                    if (xhr.status !== 200) {
                        console.error("Failed to download video data");
                    } else {
                        var arr = xhr.response;
                        videoSource.arrayBuffer = arr;
                        try {
                            sourceBuffer.appendBuffer(videoSource.arrayBuffer);
                        } catch (e) {
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

        console.log("Video source terminated locally.");

        if (videoSource.mongoId) {
            console.log('Requesting deletion from server.');
            UploadFactory.deleteFromServer(videoSource.mongoId, videoSource.mimeType);
        }
        // Else do nothing. If the videoSource doesn't have a mongoId yet, then the
        // delete request will be sent when the mongoId comes in
        // Refer to attachMongoId function to see where this is called.
    };


    vidFactory.getPrevUploads = function(mediaElements, isAudio) {
        var existingVids = mediaElements.filter(vid => vid.AVsource && vid.AVsource.mongoId).map(vid => vid.AVsource.mongoId);
        var media = isAudio ? "audio" : "videos";
        return DownloadFactory.getUserMedia(media, userId)
            .then(function(mediaData) {
                return mediaData.filter(media => existingVids.indexOf(media._id) === -1);
            });
    };

    return vidFactory;
});
