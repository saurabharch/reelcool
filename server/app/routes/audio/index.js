// utilities
var Promise = require('bluebird');
var fs = require('fs');
Promise.promisifyAll(fs);
var path = require('path');

// express and models
var router = require('express').Router();
var Audio = require('mongoose').model('Audio');

// file paths setup
var filesPath = path.join(__dirname, "..", "..", "..", "files");
var userDir;
var uploadedFilesPath;

router.use(function (req,res,next) {
    // all this has to be inside of router.use (or at least the userDir part) so that we have access to req
    userDir = req.user ? req.user._id.toString() : 'anon'; // to prevent errors/crashes in case we somehow fail to enforce login
    uploadedFilesPath = path.join(filesPath,userDir,"uploaded");
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
        var audio = {
            title: parsedFile.name
        };
        if (req.user) audio.editor = req.user._id; // if user is not logged in, we won't remember who uploaded the audio. sorry.
        Audio.create(audio)
            .then(function(created) {
                cb(null, created._id + parsedFile.ext);
            });
    }
});
var upload = multer({
    storage: storage
});


router.post('/upload', upload.single('uploadedFile'), function(req, res) {
    var parsedFile = path.parse(req.file.filename);
    res.status(201).send(parsedFile.name);
});

router.delete('/:audioId', function (req,res) {
    let audioId = req.params.audioId;
    let filename = audioId + '.mp3';
    let fullFilePath = path.join(uploadedFilesPath,filename);

    fs.unlinkAsync(fullFilePath)
        .then(
            // file found, proceed to delete reference from db
            () => true,
            // unlink will err if file not found, that's why we need this whole block,
            // to keep this on the success chain
            () => console.log('File not found. Attempting to remove any remaining reference to it from db.')
        )
        .then( () => Audio.findByIdAndRemove(audioId))
        .then(function (removed) {
            if (removed) res.send(removed);
            else res.status(404).send();
        });

});


router.get('/getconverted/:userId/:audioId',function (req,res){
    var filename = req.params.audioId+'.mp3';
    var pathToVid = path.join(filesPath, req.params.userId, 'uploaded', filename);
    fs.createReadStream(pathToVid).pipe(res);
});


router.get('/byuser/:userId',function (req,res) {
    let userId = req.params.userId;
    if (userId==='anon' || userId===undefined) res.status(404).send('User not logged in.');
    else {
        // Only want webm videos because other extensions are not ready to plug into MediaSource
        // They'll get updated to webm once they are converted.
        Audio.find({editor:userId}).select('_id title')
            .then(audioFiles => {
                // var audioIds = audioFiles.map(audio => audio._id);
                res.send(audioFiles);
            })
            .then(null, e => {
                let msg = `Unable to find audio files for ${userId}`;
                console.error(msg);
                console.error(e);
                res.status(404).send(msg);
            });
    }
});


router.get("/themes", function (req, res, next) {
    Audio.find({theme: true}).select('_id title')
        .then(
            audioFiles => res.send(audioFiles), 
            err => next(err)
        );
});

router.get("/themes/:audioId", function (req, res, next) {
    Audio.findById(req.params.audioId).exec().then(function (theme) {
        var pathToVid = path.join(filesPath, 'themes', theme.title + ".mp3");
        fs.createReadStream(pathToVid).pipe(res);
    }).then(null, next);
});


module.exports = router;
