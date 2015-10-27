var mongoose = require('mongoose');
require('../../server/db/models');
var User = mongoose.model('User');
var Promise = require('bluebird');
var rimrafAsync = Promise.promisify(require("rimraf"));
var path = require("path");

var removeUserDir = function (userMongoId) {
	return User.find({}).exec().then(function (users) {
		return Promise.map(
			users, 
			u => rimrafAsync(path.join(__dirname,"../../server/files/"+u._id))
			);
	});
};

module.exports = removeUserDir;

