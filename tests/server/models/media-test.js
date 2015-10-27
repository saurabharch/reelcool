var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var sinon = require('sinon');
var expect = require('chai').expect;
var mongoose = require('mongoose');
var remUserDir = require("../../helper/remUserDir");

// Require in all models.
require('../../../server/db/models');

var User = mongoose.model('User');
var Video = mongoose.model('Video');
var Audio = mongoose.model('Audio');

var userId;
var userObj = {
	email: 'email@email.com',
	password: 'pwd'
};
var videoObj1 = {title: "bison", ext: ".webm"};
var videoObj2 = {ext: ".webm"};
var videoObj3 = {title: "bison"};

describe('Video model', function () {

    beforeEach('Establish DB connection', function (done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });

    beforeEach('Create a user', function (done) {
        User.create(userObj)
        	.then(
        		user => {
        			userId = user._id;
        			videoObj1.editor = userId;
        			videoObj2.editor = userId;
        			videoObj3.editor = userId;
        			setTimeout(function() {
        				done();
        			}, 500); // TODO: Need a better way to make sure the post-save hook has time to run.
        		}
        	);
    });

    afterEach("Remove user directories", function () {
        return remUserDir();
    });

    afterEach('Clear test database', function (done) {
        clearDB(done);
    });

    it('should exist', function () {
        expect(Video).to.be.a('function');
    });

    it('should have a title, an extension, and a user reference (editor field)', function (done) {
    	Video.create(videoObj1)
    		.then( video => {
    			expect(video.title).to.be.a('string');
    			expect(video.ext).to.be.a('string');
    			expect(video.editor).to.be.an('object');
    			done();
    			});
    });

    it('should require a title', function (done) {
    	Video.create(videoObj2).then(null,
			function (e) {
				expect( e.message ).to.equal( 'Video validation failed' );
				expect( e.errors.title.message ).to.equal("Path `title` is required.");
				done();
			});
    });

    it('should require an extension', function (done) {
    	Video.create(videoObj3).then(null,
			function (e) { 
				expect( e.message ).to.equal( 'Video validation failed' );
				expect( e.errors.ext.message ).to.equal("Path `ext` is required.");
				done();
			});
    });

    it('should require an editor', function (done) {
    	delete videoObj1.editor;
    	Video.create(videoObj1).then(null,
			function (e) { 
				expect( e.message ).to.equal( 'Video validation failed' );
				expect( e.errors.editor.message ).to.equal("Path `editor` is required.");
				done();
			});
    });

});