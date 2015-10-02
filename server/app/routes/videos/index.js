var ffmpeg = require('fluent-ffmpeg');

var fs = require('fs');
var path = require('path');

var express = require('express');
var router = express.Router();

//var command = ffmpeg(fs.createReadStream(path.join(__dirname, 'IMG_2608.MOV')));

//app.use(express.static(__dirname + '/flowplayer'));

// router.get('/:filename', function(req, res){
//   var pathToMovie = path.join(__dirname,"../../files/",req.params.filename);
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
}

router.get('/gray/:filename', function(req, res){
  var pathToMovie = path.join(__dirname,"../../../files/",req.params.filename);
  var outPath = path.join(__dirname,"../../../files/gray/", req.params.filename);
  console.log("path to movie", pathToMovie);
  console.log("out path", outPath);

  var proc = ffmpeg(pathToMovie)
  .videoFilters(blur)
  .on('end', function(files){
    console.log("done graying");
  })
  .on('error', function(err){
    console.log("error happened:", err.message);
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
            proc.input(clipPath)
          })
          proc.mergeToFile(finalFilePath);
      }
    })
    .run();

  });
});

router.get('/combine/:filename', function(req, res) {
  //res.send(ffmpeg.toString());
  //res.contentType('flv');
  // make sure you set the correct path to your video file storage
  var pathToMovie = path.join(__dirname,"../../files/",req.params.filename);
  var outPath = path.join(__dirname,"../../files/","output.avi");
  var proc = ffmpeg(pathToMovie)
    .input(pathToMovie)
    .setStartTime(2)
    .input(pathToMovie)
    .setStartTime(2)
    //use the 'flashvideo' preset (located in /lib/presets/flashvideo.js)
    //.preset('flashvideo')
    // setup event handlers
    .on('end', function() {
     console.log('file has been converted succesfully');
    })
    .on('error', function(err) {
     console.log('an error happened: ' + err.message);
    })
    .mergeToFile(outPath)
    // save to stream
    //.pipe(res, {end:true});
    res.send("done");
});

router.get('/violet/:filename', function(req, res){
  var pathToMovie = path.join(__dirname,"../../files/",req.params.filename);
  var outPath =  path.join(__dirname,"../../files/",'outpurple.avi');
  var outStream = fs.createWriteStream(outPath);

  var proc = ffmpeg(pathToMovie)
  .setStartTime(2)
  .videoFilters('pad=640:480:0:40:violet')
  .on('end', function(){
    console.log('finished processing');
  })
  .saveToFile(outPath);
  res.send("done");

})

module.exports = router;
