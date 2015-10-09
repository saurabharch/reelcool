// utilities
var spawn = require('child_process').spawn;
var fs = require('fs');
var path = require('path');
var ffmpeg = require('fluent-ffmpeg');

// express and models
var router = require('express').Router();
var Video = require('mongoose').model('Video');

// multer file handling
var uploadedFilesPath = path.join(__dirname, "..", "..", "..", "temp"); // make this an app.value
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadedFilesPath);
    },
    filename: function(req, file, cb) {
        var parsedFile = path.parse(file.originalname);
        var video = { title: parsedFile.name };
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
    blur: 'boxblur=luma_radius=5:luma_power=3',
    invert: 'lutrgb=r=maxval+minval-val:g=maxval+minval-val:b=maxval+minval-val'
};



router.post('/download', function(req, res) {
    // var outPath = path.join(__dirname,"../../../files/");
    // var finalFilePath = path.join(__dirname,"../../../files/final.avi");

    var instructions = [
    {
      videoSource: { _id: '56171642a6722ae811bf80e4', startTime: '20', endTime: '30', filter: filters.sepia}
    },
    {
      videoSource: { _id: '5617165ba6722ae811bf80e5', startTime: '121', endTime: '131', filter: filters.grayscale}
    },
    {
      videoSource: { _id: '56171665a6722ae811bf80e6', startTime: '10', endTime: '20', filter: filters.invert}
    }
    ];
    var vidsDone = 0;
    var folder = (new Date()).getTime().toString();
    fs.mkdirSync(path.join(__dirname,'..','..','..','temp',folder));

    instructions.forEach(function(instruction, ind){
      var vid = instruction.videoSource;
      var duration = (Number(vid.endTime)-Number(vid.startTime)).toString();

      var ffmpeg = spawn('ffmpeg', ['-ss', vid.startTime, '-i', 'server/temp/'+vid._id+".webm",'-t',duration, '-filter_complex',vid.filter,'-strict', 'experimental', '-preset', 'ultrafast', '-vcodec', 'libx264', 'server/temp/'+folder+'/'+ind+'.mp4', '-y']);
      ffmpeg.on('exit', function(code, signal) {
          console.log(ind, 'hey!!!, done!');
          vidsDone++;
          if(vidsDone==instructions.length){
            console.log('yay!');
          res.end();
          }
          req.resume();
      });

      
    });
    // req.connection.pipe(ffmpeg.stdin);
    // var instructions = req.body.data;
    // instructions.forEach(function(instruction, ind){
    //   instruction.path = path.join(outPath,ind.toString()+'.avi');
    // });
    // console.log(instructions);
    // var numClips = instructions.length;
    // var clipsAdded = 0;
    // var clips = [];
    // var proc = ffmpeg()
    //     .on('end', function() {
    //      console.log('file has been converted succesfully');
    //     });
    //  .on('error', function(err) {
    //   console.log('an error happened: ' + err.message);
    // });

    // instructions.forEach(function(step, index){
    //   var duration = step.endTime-step.startTime;
    //   var clip = ffmpeg().input(step.path)
    //   .output(outPath+index.toString()+'.ogv')
    //   .on('end', function(){
    //     clips[index]=(outPath+index.toString()+'.ogv');
    //     clipsAdded++;
    //     if(clipsAdded===numClips){

    // //         clips.forEach(function(clipPath){
    //   instructions.forEach(function(clip){
    //           proc.input(clip.path);
    //   });
    // proc.input(path.join(__dirname,"../../../temp","1.mp4"));
    // proc.input(path.join(__dirname,"../../../temp","2.mp4"));
    // proc.input(path.join(__dirname,"../../../files","c.avi"));
    // proc.mergeToFile(finalFilePath);
});

router.post('/upload', upload.single('uploadedFile'), function(req, res) {
    var parsedFile = path.parse(req.file.filename);
    if (parsedFile.ext === ".webm") res.status(201).send(parsedFile.name);
    else {
        var dest = req.file.destination + '/' + parsedFile.name + '.webm';
        console.log(req.file.path); // original file
        console.log(dest); // new file

        var ffmpeg = spawn('ffmpeg', ['-i', req.file.path, '-c:v', 'libvpx', '-crf', '10', '-b:v', '1M', '-c:a', 'libvorbis', dest, '-y']);
        ffmpeg.on('message',function(msg){console.log(msg); });
        ffmpeg.on('error',function(err){console.error(err); });
        ffmpeg.on('exit', function(code, signal) {
            console.log('converted to .webm');
            fs.unlink(req.file.path,function(err){
              console.log('deleted that old file with the dumb extension');
              req.resume();
              res.status(201).send(parsedFile.name);              
            });
        });
    }
});

module.exports = router;
