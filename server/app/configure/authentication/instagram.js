'use strict';

var passport = require('passport');
var InstagramStrategy = require('passport-instagram').Strategy;
var mongoose = require('mongoose');
var UserModel = mongoose.model('User');

module.exports = function (app) {

    var instagramConfig = app.getValue('env').INSTAGRAM;

    var instagramCredentials = {
        clientID: instagramConfig.clientID,
        clientSecret: instagramConfig.clientSecret,
        callbackURL: instagramConfig.callbackURL
    };

    var verifyCallback = function (accessToken, refreshToken, profile, done) {

        UserModel.findOne({ 'instagram.id': profile.id }).exec()
            .then(function (user) {

                if (user) {
                    return user;
                } else {
                    return UserModel.create({
                        instagram: {
                            id: profile.id
                        }
                    });
                }

            }).then(function (userToLogin) {
                done(null, userToLogin);
            }, function (err) {
                console.error('Error creating user from Google authentication', err);
                done(err);
            });

    };

    passport.use(new InstagramStrategy(instagramCredentials, verifyCallback));

    app.get('/auth/instagram', passport.authenticate('instagram'));

    app.get('/auth/instagram/callback',
        passport.authenticate('instagram', { failureRedirect: '/login' }),
        function (req, res) {
            res.redirect('/');
        });

};
