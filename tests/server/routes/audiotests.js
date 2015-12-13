var mongoose = require('mongoose');
require('../../../server/db/models');
var Audio = mongoose.model('Audio');
var Promise = require("bluebird");
var expect = require('chai').expect;
var loggedInUserAgent = require('../../helper/loggedInAgent');
var path = require("path");
var fs = require("fs");
var remUserDir = require("../../helper/remUserDir");
var doesFileExist = require("../../helper/doesFileExist");

var dbURI = 'mongodb://localhost:27017/reelTestingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');



describe('The Audio route', function() {

  beforeEach('Establish DB connection', function(done) {
    if (mongoose.connection.db) return done();
    mongoose.connect(dbURI, done);
  });

  afterEach('Clear test database', function(done) {
    clearDB(done);
  });

  afterEach("Remove user directories", function() {
    return remUserDir();
  });

  var loggedInAgent;

  beforeEach('Create loggedIn user agent and authenticate', function() {
    return loggedInUserAgent()
      .then(function(userAgent) {
        loggedInAgent = userAgent;
      });
  });


  xdescribe("for POST", function() {

    it('should create a DB entry with audio file title and editor', function(done) {
      loggedInAgent
        .post("/api/audio/upload")
        .attach("uploadedFile", path.join(__dirname, "../../fixtures/audiotest.mp3"))
        .expect(201)
        .end(function(err, res) {
          var fileName = res.text;
          Audio.findById(fileName).exec()
            .then(function(audio) {
              expect(audio.title).to.equal("audiotest");
              expect(audio.editor.toString()).to.equal(loggedInAgent.mongoId.toString());
              expect(audio.theme).to.equal(false);
              done()
            }).then(null, done);
        });

    });


    it('should put the uploaded file in the users uploaded directory', function(done) {
      loggedInAgent
        .post("/api/audio/upload")
        .attach("uploadedFile", path.join(__dirname, "../../fixtures/audiotest.mp3"))
        .expect(201)
        .end(function(err, res) {
          var fileName = res.text;
          var fileExists = doesFileExist(loggedInAgent.mongoId, "uploaded", fileName + ".mp3");
          expect(fileExists).to.equal(true);
          done();
        });
    });

  });



  describe("for DELETE", function() {

    var audioMongoId;

    beforeEach("give the user an audio file", function() {
      // create audio entry in DB
      console.log("mongoooooID", loggedInAgent.mongoId);
      return Audio.create({
          title: "sample",
          editor: loggedInAgent.mongoId
        })
        .then(function(newAudio) {

          // cp audio file in user dir
          var sourcePath = path.join(__dirname, "../../fixtures/audiotest.mp3"),
            destPath = path.join(__dirname, "../../../server/files/" +
              loggedInAgent.mongoId + "/uploaded/" + newAudio._id + ".mp3");
          fs.createReadStream(sourcePath).pipe(fs.createWriteStream(destPath));

          audioMongoId = newAudio._id;
        });
    });


    it('should remove the corresponding file from the users directory', function(done) {

      // file should exist before deletion
      var fileExists = doesFileExist(loggedInAgent.mongoId, "uploaded",
        audioMongoId + ".mp3");
      expect(fileExists).to.equal(true);

      loggedInAgent
        .delete("/api/audio/" + audioMongoId)
        .end(function(err, res) {

          fileExists = doesFileExist(loggedInAgent.mongoId, "uploaded",
            audioMongoId + ".mp3");
          expect(fileExists).to.equal(false);
          done();

        });

    });




    it('should remove the corresponding entry in the DB', function(done) {

      var callDelete = function() {
        loggedInAgent
          .delete("/api/audio/" + audioMongoId)
          .end(function(err, res) {
            Audio.findById(audioMongoId).exec()
              .then(function(audio) {
                expect(audio).to.equal(null);
                done();
              }).then(null, done);
          });
      };

      // the DB entry should exist before deletion
      Audio.findById(audioMongoId).exec()
        .then(function(audio) {
          expect(audio).not.to.equal(null);
          callDelete();
        }).then(null, done);


    });




  });



});


