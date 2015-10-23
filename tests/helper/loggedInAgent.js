var mongoose = require('mongoose');
var supertest = require('supertest-as-promised');
var app = require('../../server/app');
require('../../server/db/models');
var User = mongoose.model('User');

var userObj = {
			email: 'email@email.com',
			password: 'pwd'
};

module.exports = function () {
	var loggedInAgent;
	return User.create(userObj)
	.then(function (createdUser) {
		loggedInAgent = supertest.agent(app);
		loggedInAgent.mongoId = createdUser._id;
		return loggedInAgent.post('/login').send(userObj);
	})
	.then(function () {
		return loggedInAgent;
	})
	.then(null, function (error) {
		console.error("Error creating logged in user:", error);
	});
};