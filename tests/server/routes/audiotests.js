var mongoose = require('mongoose');
require('../../../server/db/models');
var Audio = mongoose.model('Audio');
var Promise = require("bluebird");
var expect = require('chai').expect;
var loggedInUserAgent = require('../../helper/loggedInAgent');
var path = require("path");
var fs = require("fs");
var remUserDir = require("../../helper/remUserDir");

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

	afterEach("Remove user directories", function () {
		return remUserDir();
	});

	var loggedInAgent;

	beforeEach('Create loggedIn user agent and authenticate', function() {
		return loggedInUserAgent()
			.then(function(userAgent) {
				loggedInAgent = userAgent;
			});
	});


	it('should allow uploading audio files', function(done) {

		loggedInAgent
		.post("/api/audio/upload")
		.attach("uploadedFile", path.join(__dirname, "../../fixtures/audiotest.mp3"))
		.expect(201)
		.end(function (err, res) {
			var fileName = res.text;

			fs.accessSync(path.join(__dirname, "../../../server/files/" +
				loggedInAgent.mongoId + "/uploaded/" + fileName + ".mp3"), fs.F_OK);


			Audio.findById(fileName).exec()
			.then(function (audio) {
				expect(audio.title).to.equal("audiotest");
				expect(audio.editor.toString()).to.equal(loggedInAgent.mongoId.toString());
				expect(audio.theme).to.equal(false);
				done();
			}).then(null, done);


		});

	});




	it('should allow deleting audio files', function(done) {

		var useDeleteRoute = function (audioMongoId) {
			loggedInAgent
			.delete("/api/audio/" + audioMongoId)
			.end(function (err, res) {

				try {
					fs.statSync(path.join(__dirname, "../../../server/files/" +
						loggedInAgent.mongoId + "/uploaded/" + audioMongoId + ".mp3"));
					expect(true).to.be(false);
				} catch (e) {
					// catch expected error, since file should not be there anymore
				}

				//console.log("FSTAT:", fStat);

				Audio.findById(audioMongoId).exec()
				.then(function (audio) {
					expect(audio).to.equal(null);
					done();
				}).then(null, done);

			});
		};


		// create audio entry in DB
		Audio.create({title: "sample", editor: loggedInAgent.mongoId})
		.then(function (audio) {

			// cp audio file in user dir
			var sourcePath = path.join(__dirname, "../../fixtures/audiotest.mp3"),
				destPath = path.join(__dirname, "../../../server/files/" +
					loggedInAgent.mongoId + "/uploaded/sample.mp3");
			fs.createReadStream(sourcePath).pipe(fs.createWriteStream(destPath));

			// using the route to delete the audio file
			useDeleteRoute(audio._id);
		});


	});



});