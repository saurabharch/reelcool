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
