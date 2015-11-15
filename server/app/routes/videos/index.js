// utilities
var Promise = require('bluebird');
var fs = require('fs.extra');
Promise.promisifyAll(fs);
var path = require('path');
var ffmpegUtils = require('../../ffmpeg-utils');

// express and models
var router = require('express').Router();
var Video = require('mongoose').model('Video');

// file paths setup
var filesPath = path.join(__dirname, "..", "..", "..", "files");
var themesPath = path.join(filesPath, "themes");
var userDir;
var uploadedFilesPath;
var stagingAreaPath;
var createdFilePath;
var tempFilePath;
var sampleVideosPath = path.join(__dirname,"..","..","..","files/samples");

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
        let parsedFile = path.parse(file.originalname);
        let video = {
            title: parsedFile.name,
            ext: parsedFile.ext
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

router.post('/makeit', function(req, res, next) {
    let instructions = req.body.instructions;
    let audio = req.body.audio;
    ffmpegUtils
        .makeIt(
            instructions,
            audio,
            themesPath,
            uploadedFilesPath,
            stagingAreaPath,
            tempFilePath,
            createdFilePath
            )
        .then(
            finalName => res.status(201).send(finalName),
            err => next(err)
            );
});

router.get('/getconverted/:userId/:videoId',function (req,res){
    var filename = req.params.videoId+'.webm';
    var pathToVid = path.join(filesPath, req.params.userId, 'uploaded', filename);
    fs.createReadStream(pathToVid).pipe(res);
});

router.get('/download/:videoId',function (req,res) {
    res.setHeader('Content-disposition', 'attachment; filename=reelcoolmovie.mp4');
    res.setHeader('Content-type', 'video/mp4');

    var pathToMovie = path.join(createdFilePath,req.params.videoId);
    fs.createReadStream(pathToMovie).pipe(res);
});

router.post('/upload', upload.single('uploadedFile'), function(req, res) {
    var parsedFile = path.parse(req.file.filename);
    console.log("parsedFile", parsedFile);
    var mongoId = parsedFile.name;
    console.log("mongoId", mongoId);
    var desiredExt = '.webm';
    // if it was a webm file, send back the mongoId reference right away
    // so it can be attached to the video file awaiting in the client
    if (parsedFile.ext===desiredExt) res.status(201).send(mongoId);
    else {
        // allow this conversion below to happen async.
        // don't wait for it to finish. the client will just get impatient
        // and request again.
        ffmpegUtils.convertToWebm(req.file);
        res.status(201).send(); // don't send the filename/mongoId
    }
});

router.get('/samples', function(req, res){
  //for each of the sample videos, create a new record in the database linking them to current user
  //make copies of the videos in the sample folder (mongoId as name), and put them in the user's folder.
  //then they will be brought to the user via the regular polling for uploaded files.

  fs.readdirAsync(sampleVideosPath)
  .then(filenames => {
    let promisedCopies = [];
    filenames.forEach(filename => {
      let parsedFilename = path.parse(filename);
      let name = parsedFilename.name;
      let ext = parsedFilename.ext;
      if(ext === '.webm'){
        //make a record in the db for the user and then copy the file for them
        let video = {
          title: name,
          editor: req.user._id,
          ext: '.webm'
        };
        let sharedFilepath = sampleVideosPath + '/' + filename;
        let copyFilepath;
        let promisedCopy = Video.create(video)
        .then(createdVideo => {
          copyFilepath = uploadedFilesPath + '/' + createdVideo.id + ext;
          return fs.copyAsync(sharedFilepath, copyFilepath);
        });
        promisedCopies.push(promisedCopy);
      }
    });

    Promise.all(promisedCopies)
    .then(copies => {
      res.sendStatus(201);
    })
    .then(null, err => {
      res.sendStatus(err.statusCode);
    });
  });
});

router.get('/byuser/:userId',function (req,res) {
    let userId = req.params.userId;
    if (userId==='anon' || userId===undefined) res.status(404).send('User not logged in.');
    else {
        // Only want webm videos because other extensions are not ready to plug into MediaSource
        // They'll get updated to webm once they are converted.
        Video.find({editor:userId, ext:'.webm'}).select('_id title')
            .then(videos => {
                // var vidIds = videos.map(vid => vid._id);
                res.send(videos);
            })
            .then(null, e => {
                let msg = `Unable to find videos for ${userId}`;
                console.error(msg);
                console.error(e);
                res.status(404).send(msg);
            });
    }
});


router.delete('/:videoId', function (req,res) {
    let videoId = req.params.videoId;
    let filename = videoId+'.webm';
    let fullFilePath = path.join(uploadedFilesPath,filename);

    fs.unlinkAsync(fullFilePath)
        .then(
            // file found, proceed to delete reference from db
            () => true,
            // unlink will err if file not found, that's why we need this whole block,
            // to keep this on the success chain
            () => console.log('File not found. Attempting to remove any remaining reference to it from db.')
        )
        .then( () => Video.findByIdAndRemove(videoId))
        .then(function (removed) {
            if (removed) res.send(removed);
            else res.status(404).send();
        });

});
module.exports = router;
