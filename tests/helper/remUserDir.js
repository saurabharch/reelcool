var mongoose = require('mongoose');
require('../../server/db/models');
var User = mongoose.model('User');
var rimraf = require("rimraf");
var path = require("path");

var removeUserDir = function (userMongoId) {
	return User.find({}).exec().then(function (users) {
		users.forEach(function (user) {
			rimraf.sync(path.join(__dirname, "../../server/files/" + user._id));
		});
	});
};

module.exports = removeUserDir;

