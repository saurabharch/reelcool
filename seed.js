/*

This seed file uses the same file the server uses to establish
the database connection:
--- server/db/index.js

The name of the database used is set in the env files:
--- server/env/*

*/

var mongoose = require('mongoose');
var Promise = require('bluebird');
var chalk = require('chalk');
var connectToDb = require('./server/db');
// var User = Promise.promisifyAll(mongoose.model('User'));
var Audio = Promise.promisifyAll(mongoose.model('Audio'));
var fs = require("fs");

// var seedUsers = function () {

//     var users = [
//         {
//             email: 'testing@fsa.com',
//             password: 'password'
//         },
//         {
//             email: 'obama@gmail.com',
//             password: 'potus'
//         }
//     ];

//     return User.createAsync(users);

// };


var seedThemes = function () {
    var themes = [];

    var fileNames = fs.readdirSync(__dirname + "/server/files/themes");

    fileNames.forEach(function (fileName) {
        var title = fileName.split(".")[0];
        if (title) {
            themes.push({
                title: title,
                theme: true
            });            
        }
    });

    return Audio.remove({theme: true}).then(function () {
        return Audio.createAsync(themes);
    });
};

connectToDb.then(function () {
    // User.findAsync({}).then(function (users) {
    //     if (users.length === 0) {
    //         return seedUsers();
    //     } else {
    //         console.log(chalk.magenta('Seems to already be user data, exiting!'));
    //     }
    // }).then(function () {
    seedThemes().then(function () {
        console.log(chalk.green('Seed successful!'));
        process.kill(0);
    }).catch(function (err) {
        console.error(err);
        process.kill(1);
    });
});
