var ffmpeg = require('fluent-ffmpeg');
var Video = require('mongoose').model('Video');

var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');

var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var storage = multer.diskStorage({
    destination: function (req,file,cb){
      cb(null, path.join(__dirname, "..","..","..","temp"));
    },
    filename: function (req,file,cb){
      cb(null, file.originalname);
    }
});

var upload = multer({ storage: storage });
router.use(bodyParser.raw());

//var command = ffmpeg(fs.createReadStream(path.join(__dirname, 'IMG_2608.MOV')));

//app.use(express.static(__dirname + '/flowplayer'));

// router.get('/:filename', function(req, res){
//   var pathToMovie = path.josin(__dirname,"../../files/",req.params.filename);
//   var proc = ffmpeg(pathToMovie)
//       .preset('flashvideo')
//       .on('error', function(err,stdout,stderr) {
//         console.log('an error happened: ' + err.message);
//         console.log('ffmpeg stdout: ' + stdout);
//         console.log('ffmpeg stderr: ' + stderr);
//       })
//       .on('end', function() {
//         console.log('Processing finished !');
//       })
//       .on('progress', function(progress) {
//         console.log('Processing: ' + progress.percent + '% done');
//       })
//       .pipe(res, {end: true});
// });

var filters = {
  grayscale: 'colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3',
  sepia: 'colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131',
  blur: 'boxblur=luma_radius=5:luma_power=3'
};

router.get('/gray/:filename', function(req, res){
  var pathToMovie = path.join(__dirname,"../../../files/",req.params.filename);
  var outPath = path.join(__dirname,"../../../files/", "gray"+req.params.filename);
  console.log("path to movie", pathToMovie);
  console.log("out path", outPath);

  var proc = ffmpeg(pathToMovie)
  .videoFilters(filters.blur)
  .on('end', function(files){
    console.log("done graying");
    res.status(201).send();
  })
  .on('error', function(err){
    console.log("error happened:", err.message);
    res.status(500).send();
  })
  .output(outPath)
  .run();
  //.takeScreenshots({count:2, timemarks: ['1','3']}, outPath);
})

router.get('/save', function(req, res){

  var outPath = path.join(__dirname,"../../../files/out/");
  var finalFilePath = path.join(__dirname,"../../../files/out/final.ogv");
  var instructions = [
    {
      source: "lego.ogv",
      clipStartTime: '1',
      filter: 'grayscale'
    },
    {
      source: "lego.ogv",
      clipStartTime: '1',
      filter: 'blur'
    }
  ];

  var numClips = instructions.length;
  var clipsAdded = 0;
  var clips = [];

  var proc = ffmpeg()
      .on('end', function() {
       console.log('file has been converted succesfully');
      })
      .on('error', function(err) {
       console.log('an error happened: ' + err.message);
     });

  instructions.forEach(function(step, index){

    var clip = ffmpeg().input(path.join(__dirname,"../../../files/",step.source))
    .setStartTime(step.clipStartTime)
    .videoFilter(filters[step.filter])
    .output(`${outPath}${index}.ogv`)
    .on('end', function(){
      clips[index]=(`${outPath}${index}.ogv`);
      clipsAdded++;
      if(clipsAdded===numClips){
        console.log("tryna merge");

          clips.forEach(function(clipPath){
            proc.input(clipPath);
          });

          proc.mergeToFile(finalFilePath);
      }
    })
    .run();

  });
});


router.post('/upload', upload.single('uploadedFile'),function(req,res,next){
    var outName = req.file.originalname.split('.')[0]+".ogv";
    var outPath = path.join(__dirname,"../../../files/");
    var proc = ffmpeg(req.file.path)
      .on('end', function() {
        console.log('file has been converted succesfully, creating video in Mongo...');
        Video.create({
          fileName: outName,
          path: outPath,
          editor: req.user._id
        }).then(function(vid){
          res.status(201).end();
        }, function(err){
          console.log(err);
          res.json(err);
        });
        // if(req.file.originalname.split('.')[0]!==".webm"){           <---- for sending a file back if it wasn't webm

        // }
      })
      .on('error', function(err) {
        console.log('an error happened: ' + err.message);
      })
      .output(path.join(__dirname,"../../../files/",outName))
      .run();

});

module.exports = router;
