app.factory("DownloadFactory", ($http, $mdToast) => {

    let requestReelVideo = (instructions, audio) => {
        return $http.post('/api/videos/makeit', {
            instructions: instructions,
            audio: audio
        });
    };

    let promisifiedDownload = (instructions, audio) => {
        var downloadInitiating =
            $mdToast
            .simple()
            .content("Let's get you a copy of that video!")
            .position('bottom right');

        let downloadSuccess =
            $mdToast
            .simple()
            .content('Success! Your download is starting.')
            .position('bottom right')
            .hideDelay(3000);

        let downloadFail =
            $mdToast
            .simple()
            .content("Couldn't make that video. Please try again later.")
            .position('bottom right')
            .hideDelay(3000);

        $mdToast.show(downloadInitiating)
            .then(() => requestReelVideo(instructions, audio))
            .then(function(resp) {
                if (resp.status === 201) {
                    let url = '/api/videos/download/' + resp.data;
                    // this "append" is what actually causes the video file to download to the user's computer
                    $mdToast.show(downloadSuccess)
                        .then(() => $("body").append("<iframe src=" + url + " style='display: none;' ></iframe>"));
                } else {
                    $mdToast.show(downloadFail);
                    console.error('The server responded with status', resp.status);
                }
            }, 
             function (err) {
              console.log('in the fail chain');
              console.error(err);
              $mdToast.show(downloadFail);
             }
            );
    };

    return {
        requestReelVideo: requestReelVideo,
        promisifiedDownload: promisifiedDownload
    };
});
