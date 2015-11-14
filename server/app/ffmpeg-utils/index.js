var spawn = require('child_process').spawn;
var Promise = require('bluebird');
var fs = require('fs');
Promise.promisifyAll(fs);
var path = require('path');
var ffmpeg = require('fluent-ffmpeg');
var Video = require('mongoose').model('Video');
var Audio = require('mongoose').model('Audio');

function convertToWebm(file) {
    return new Promise(function(resolve, reject) {
        let parsedFile = path.parse(file.filename);
        let mongoId = parsedFile.name;
        let desiredExt = ".webm";
        let dest = file.destination + '/' + parsedFile.name + '.webm';
        let convertProc = spawn('ffmpeg', ['-i', file.path, '-c:v', 'libvpx', '-crf', '10', '-b:v', '1M', '-c:a', 'libvorbis', dest, '-y']);
        convertProc.on('message', function(msg) {
            console.log(msg);
        });
        convertProc.on('error', function(err) {
            console.error(err);
            reject(err);
        });
        convertProc.on('exit', function(code, signal) {
            fs.unlinkAsync(file.path)
                .then(function() {
                    return Video.findByIdAndUpdate(mongoId, {
                        ext: desiredExt
                    }, {
                        new: true
                    });
                })
                .then(updated => resolve(updated));
        });
    });
}

function translateBrightness(command, val) {
    let newVal;
    if (val <= 1) newVal = (1 - val) * 10 * -1;
    else newVal = (val - 1) * 4;
    return command + newVal.toString();
}

function translateContrast(command, val) {
    return command[0] + val.toString() + command[1];
}

function translateSaturation(command, val) {
    return command[0] + val.toString() + command[1];
}

function translateHue(command, val) {
    return command + val.toString();
}

var filters = {
    "Grayscale": 'colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3',
    "Sepia": 'colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131',
    "Invert": 'lutrgb=r=maxval+minval-val:g=maxval+minval-val:b=maxval+minval-val',
    "Brightness": {
        command: 'hue=b=',
        translate: translateBrightness
    },
    "Contrast": {
        command: ['eq=1:', ':0:1:1:1:1'],
        translate: translateContrast
    },
    "Saturation": {
        command: ['eq=1:1:0:', ':1:1:1'],
        translate: translateSaturation
    },
    "Hue": {
        command: 'hue=h=',
        translate: translateHue
    },
};

function makeFilterString(filtArr) {
    if (filtArr === []) return;
    return filtArr.filter(el => el.applied).map(filt => {
        let filterKey = filters[filt.displayName];
        if (filterKey.translate) {
            return filterKey.translate(filterKey.command, filt.val);
        } else return filterKey;
    }).join(', ');
}

function deleteStagedFiles(stagingAreaPath) {
    return fs.readdirAsync(stagingAreaPath)
        .then(arrayOfFiles => Promise.map(arrayOfFiles, function(file) {
            return fs.unlinkAsync(path.join(stagingAreaPath, file));
        }));
}

function deleteTempFile(tempVideoLocation) {
    return fs.unlinkAsync(tempVideoLocation);
}

function addAudio(tempFilePath, createdFilePath, audioPath) {
    let tempVideoName = 'temp.mp4';
    let tempVideoLocation = path.join(createdFilePath,tempVideoName);
    return new Promise(function(resolve, reject) {
        let finalName = String(Date.now()) + '.mp4';
        let finalDestination = path.join(createdFilePath, finalName);
        let audioProc = spawn('ffmpeg', ['-i', tempVideoLocation, '-i', audioPath, '-codec', 'copy', '-shortest', finalDestination]);
        audioProc.on('error', function(err, stdout, stderr) {
                console.error(err, stdout, stderr);
                reject(err);
            })
            .on('exit', function() {
                deleteTempFile(tempVideoLocation)
                    .then(() => resolve(finalName));
            });
    });
}

function cutAndFilter(instruction) {
    return new Promise(function(resolve, reject) {
        let vid = instruction.videoSource.mongoId;
        let sourceVid = instruction.uploadedFilesPath + '/' + vid + '.webm';
        let destVid = instruction.stagingAreaPath + '/' + instruction.id + '.mp4';
        let startTime = instruction.startTime;
        let duration = (Number(instruction.endTime) - Number(startTime)).toString();
        let filterCode = makeFilterString(instruction.filters) || "hue=b=0"; // the one on the right does nothing

        let command = ['-ss', startTime, '-i', sourceVid, '-t', duration, '-filter_complex', filterCode, '-strict', 'experimental', '-preset', 'ultrafast', '-vcodec', 'libx264', destVid, '-y'];
        let muteFlag = '-an';
        let muteFlagIdx = command.length-2; // third to last
        if (instruction.audio.id!=="original_track") command.splice(muteFlagIdx, 0, muteFlag);

        let filtersProc = spawn('ffmpeg', command);
        filtersProc.on('error', function(err, stdout, stderr) {
            console.error('Errored when attempting to convert this video. Details below.');
            console.error(err);
            console.error(stdout);
            console.error(stderr);
            reject(err);
        });
        filtersProc.on('exit', function(code, signal) {
            console.log('Filtered and converted', vid);
            resolve(vid);
        });
    });
}

function mergeVids(mergedVideo, instructions, audioPath, tempFilePath, createdFilePath, stagingAreaPath) {
    return new Promise(function(resolve, reject) {
        let createdVidName = 'temp.mp4';
        let mergedVideoDest = path.join(createdFilePath, createdVidName);

        // add inputs in the same order as they were in the instructions
        instructions.forEach(function(inst) {
            let filename = inst.id + '.mp4';
            let input = path.join(stagingAreaPath, filename);
            mergedVideo.addInput(input);
        });

        mergedVideo.mergeToFile(mergedVideoDest, tempFilePath)
            .on('error', function(err, stdout, stderr) {
                console.error('Error ' + err.message);
                console.error(stdout);
                console.error(stderr);
                reject(err);
            })
            .on('end', function() {
                console.log('Finished merging!');
                resolve({
                    mergedVideoDest: mergedVideoDest,
                    createdFilePath: createdFilePath,
                    audioPath: audioPath
                });
            });
    });
}

function makeIt(instructions, audio, themesPath, uploadedFilesPath, stagingAreaPath, tempFilePath, createdFilePath) {
    instructions.map(function(inst) {
    	 inst.audio = audio;
        inst.themesPath = themesPath;
        inst.uploadedFilesPath = uploadedFilesPath;
        inst.stagingAreaPath = stagingAreaPath;
        inst.tempFilePath = tempFilePath;
        inst.createdFilePath = createdFilePath;
    });
    let mergedVideo = ffmpeg();
    return new Promise(function(resolve, reject) {
        Promise.map(instructions, cutAndFilter)
            .then(function(vids) {
                if (audio.id !== "original_track") {
                    return Audio.findById(audio.id)
                        .then(audio => {
                            let audioPath =
                                (audio.theme ? themesPath : uploadedFilesPath) +
                                "/" + (audio.theme ? audio.title : audio._id) + ".mp3";
                            return audioPath;
                        });
                } else return ''; // falsey
            })
            .then(audioPath => mergeVids(mergedVideo, instructions, audioPath, tempFilePath, createdFilePath, stagingAreaPath))
            .then(function(mergedVideoInfo) {
                let mergedVideoDest = mergedVideoInfo.mergedVideoDest;
                let createdFilePath = mergedVideoInfo.createdFilePath;
                let audioPath = mergedVideoInfo.audioPath;
                if (audioPath) return addAudio(tempFilePath, createdFilePath, audioPath);
                else {
                    let finalName = String(Date.now()) + '.mp4';
                    let finalDestination = path.join(createdFilePath, finalName);
                    return fs.renameAsync(mergedVideoDest, finalDestination)
                        .then(() => finalName);
                }
            })
            .then(finalName => deleteStagedFiles(stagingAreaPath).then(() => resolve(finalName)))
            .catch(e => {
                console.error(e);
                reject(e);
            });
    });
}


module.exports = {
    convertToWebm: convertToWebm,
    makeIt: makeIt
};
