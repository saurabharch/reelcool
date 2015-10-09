// utilities
var spawn = require('child_process').spawn;
var Promise = require('bluebird');
var fs = require('fs');
Promise.promisifyAll(fs);
var path = require('path');
var ffmpeg = require('fluent-ffmpeg');

// express and models
var router = require('express').Router();
var Video = require('mongoose').model('Video');

// file paths setup
var filesPath = path.join(__dirname, "..", "..", "..", "files");
var userDir;
var uploadedFilesPath;
var stagingAreaPath;
var createdFilePath;
var tempFilePath;

router.use(function (req,res,next) {
    // all this has to be inside of router.use (or at least the userDir part) so that we have access to req
    userDir = req.user ? req.user._id.toString() : 'anon'; // to prevent errors/crashes in case we somehow fail to enforce login
    uploadedFilesPath = path.join(filesPath,userDir,"uploaded"); 
    stagingAreaPath = path.join(filesPath,userDir,"staging");
    createdFilePath = path.join(filesPath,userDir,"created");
    tempFilePath = path.join(filesPath,userDir,"temp");
    next();   
});

// multer file handling
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadedFilesPath);
    },
    filename: function(req, file, cb) {
        var parsedFile = path.parse(file.originalname);
        var video = {
            title: parsedFile.name
        };
        if (req.user) video.editor = req.user._id; // if user is not logged in, we won't remember who uploaded the video. sorry.
        Video.create(video)
            .then(function(created) {
                cb(null, created._id + parsedFile.ext);
            });
    }
});
var upload = multer({
    storage: storage
});


//var command = ffmpeg(fs.createReadStream(path.join(__dirname, 'IMG_2608.MOV')));


var filters = {
    grayscale: 'colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3',
    sepia: 'colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131',
    blur: 'boxblur=luma_radius=5:luma_power=3'
};



router.post('/download', function(req, res) {
    // var outPath = path.join(__dirname,"../../../files/");
    // var finalFilePath = path.join(__dirname,"../../../files/final.avi");

    var instructions = [{
        videoSource: {
            _id: '56180ce49981701c489bce10',
            startTime: '0',
            endTime: '3',
            filter: filters.sepia
        }
    }, {
        videoSource: {
            _id: '56180d159981701c489bce11',
            startTime: '2',
            endTime: '5',
            filter: filters.grayscale
        }
    }, {
        videoSource: {
            _id: '56180deceedca13e4862cddc',
            startTime: '5',
            endTime: '10',
            filter: filters.blur
        }
    }];
    var vidsDone = 0;
    var mergedVideo = ffmpeg();

    instructions.forEach(function(instruction, ind) {
        var vid = instruction.videoSource;
        var sourceVid = uploadedFilesPath + '/' + vid._id + '.webm';
        var destVid = stagingAreaPath + '/' + vid._id + '.mp4';
        var duration = (Number(vid.endTime) - Number(vid.startTime)).toString();
        var filtersProc = spawn('ffmpeg', ['-ss', vid.startTime, '-i', sourceVid, '-t', duration, '-vf', vid.filter, '-strict', 'experimental', '-preset', 'ultrafast', '-vcodec', 'libx264', destVid, '-y']);
        filtersProc.on('exit', function(code, signal) {
            console.log('I filtered and converted', vid._id);
            vidsDone++;
            mergedVideo.addInput(destVid);
            if (vidsDone == instructions.length) {
                console.log('filters done, now going to merge');
                mergeVids(mergedVideo, createdFilePath);
            }
            req.resume();
        });
    });

    function mergeVids(mergedVideo) {
        var createdVidName = Date.now() + '.mp4';
        var mergedVideoDest = path.join(createdFilePath,createdVidName); // name of file based on Date.now(). file is already located in the user's created folder so it we would be able to pull it up
        mergedVideo.mergeToFile(mergedVideoDest, tempFilePath)
            .on('error', function(err) {
                console.log('Error ' + err.message);
            })
            .on('end', function() {
                console.log('Finished!');
                deleteStagedFiles().then(() => sendMovie(res, createdVidName));
            });
    }

    function deleteStagedFiles () {
        return fs.readdirAsync(stagingAreaPath)
            .then(arrayOfFiles => Promise.map(arrayOfFiles, function (file) { return fs.unlinkAsync(path.join(stagingAreaPath, file)); }));
    }

    function sendMovie (res, fileName) {
        res.setHeader('Content-disposition', 'attachment; filename=reelcoolmovie.mp4');
        res.setHeader('Content-type', 'video/mp4');
        var pathToMovie = path.join(createdFilePath,fileName);
        fs.createReadStream(pathToMovie).pipe(res);
    }

});

router.post('/upload', upload.single('uploadedFile'), function(req, res) {
    var parsedFile = path.parse(req.file.filename);
    if (parsedFile.ext === ".webm") res.status(201).send(parsedFile.name);
    else {
        var dest = req.file.destination + '/' + parsedFile.name + '.webm';
        console.log(req.file.path); // original file
        console.log(dest); // new file

        var ffmpeg = spawn('ffmpeg', ['-i', req.file.path, '-c:v', 'libvpx', '-crf', '10', '-b:v', '1M', '-c:a', 'libvorbis', dest, '-y']);
        ffmpeg.on('message', function(msg) {
            console.log(msg);
        });
        ffmpeg.on('error', function(err) {
            console.error(err);
        });
        ffmpeg.on('exit', function(code, signal) {
            console.log('converted to .webm');
            fs.unlink(req.file.path, function(err) {
                console.log('deleted that old file with the dumb extension');
                req.resume();
                res.status(201).send(parsedFile.name);
            });
        });
    }
});

module.exports = router;
