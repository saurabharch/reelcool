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

var filters = {
    "grayscale()": 'colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3',
    "sepia()": 'colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131',
    "blur()": 'boxblur=luma_radius=5:luma_power=3',
    "invert()": 'lutrgb=r=maxval+minval-val:g=maxval+minval-val:b=maxval+minval-val'
};

router.post('/makeit', function(req, res) {
    let instructions = req.body;
    let vidsDone = 0;
    let mergedVideo = ffmpeg();

    instructions.forEach(function(instruction, ind) {
        let vid = instruction.videoSource.mongoId;
        let sourceVid = uploadedFilesPath + '/' + vid + '.webm';
        let destVid = stagingAreaPath + '/' + vid + '.mp4';
        let startTime = instruction.startTime;
        let duration = (Number(instruction.endTime) - Number(startTime)).toString();
        // TODO: Need an option for "no filter" that doesn't break the child process 
        // (which expects a filter). If instruction.filter is left "undefined", the proc breaks.
        // That's why we currently force it to have grayscale if it doesn't already have a filter.
        let filterName = instruction.filter || "grayscale"; 
        let filterCode = filters[filterName];
        
        let filtersProc = spawn('ffmpeg', ['-ss', startTime, '-i', sourceVid, '-t', duration, '-filter_complex', filterCode, '-strict', 'experimental', '-preset', 'ultrafast', '-vcodec', 'libx264', destVid, '-y']);
        filtersProc.on('error',function(err,stdout,stderr){
            console.error('Errored when attempting to convert this video. Details below.');
            console.error(err);
            console.error(stdout);
            console.error(stderr);
        });
        filtersProc.on('exit', function(code, signal) {
            console.log('Filtered and converted', vid);
            vidsDone++;
            if (vidsDone == instructions.length) {
                console.log('Filters done, now merging.');
                mergeVids(mergedVideo, createdFilePath, instructions);
            }
            req.resume();
        });
    });

    function mergeVids(mergedVideo, createdFilePath, instructions) {
        let createdVidName = Date.now() + '.mp4';
        let mergedVideoDest = path.join(createdFilePath,createdVidName); // name of file based on Date.now(). file is already located in the user's created folder so it we would be able to pull it up

        // add inputs in the same order as they were in the instructions
        instructions.forEach(function (inst) {
            let filename = inst.videoSource.mongoId+'.mp4';
            let input = path.join(stagingAreaPath,filename);
            mergedVideo.addInput(input);
        });
        
        mergedVideo.mergeToFile(mergedVideoDest, tempFilePath)
            .on('error', function(err) {
                console.log('Error ' + err.message);
            })
            .on('end', function() {
                console.log('Finished!');
                deleteStagedFiles().then(() => res.status(201).send(createdVidName));
            });
    }

    function deleteStagedFiles () {
        return fs.readdirAsync(stagingAreaPath)
            .then(arrayOfFiles => Promise.map(arrayOfFiles, function (file) { return fs.unlinkAsync(path.join(stagingAreaPath, file)); }));
    }
    
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
    var mongoId = parsedFile.name;
    var desiredExt = '.webm';
    if (parsedFile.ext === desiredExt) res.status(201).send(parsedFile.name);
    else {
        var dest = req.file.destination + '/' + parsedFile.name + '.webm';
        var ffmpeg = spawn('ffmpeg', ['-i', req.file.path, '-c:v', 'libvpx', '-crf', '10', '-b:v', '1M', '-c:a', 'libvorbis', dest, '-y']);
        ffmpeg.on('message', function(msg) {
            console.log(msg);
        });
        ffmpeg.on('error', function(err) {
            console.error(err);
            res.status(500).send();
        });
        ffmpeg.on('exit', function(code, signal) {
            fs.unlinkAsync(req.file.path)
                .then(function () {
                    return Video.findByIdAndUpdate(mongoId, { ext: desiredExt }, {new: true});
                })
                .then(updated => res.status(201).send(updated._id));
        });
    }
});

router.get('/byuser/:userId',function (req,res) {
    let userId = req.params.userId;
    if (userId==='anon' || userId===undefined) res.status(404).send('User not logged in.');
    else {
        // Only want webm videos because other extensions are not ready to plug into MediaSource
        // They'll get updated to webm once they are converted.
        Video.find({editor:userId, ext:'.webm'}).select('_id')
            .then(videos => {
                var vidIds = videos.map(vid => vid._id);
                res.send(vidIds);
            })
            .catch(e => {
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
