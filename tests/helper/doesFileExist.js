var fs = require("fs");
var path = require("path");

var doesFileExist = function (userMongoId, subFolder, fileName) {
  try {
    fs.statSync(path.join(__dirname, "../../server/files/" +
      userMongoId + "/" + subFolder + "/" + fileName));
    return true;
  } catch (e) {
    return false;
  }
};

module.exports = doesFileExist;