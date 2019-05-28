'use strict';
require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

const User = require('../models/User');
const SpotifyStrategy = require('passport-spotify').Strategy;



function hookSpotifyStrategy(passport) {
    passport.use(
        new SpotifyStrategy(
            {
                clientID: process.env.SPOTIFY_CLIENT_ID,
                clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
                callbackURL: 'http://localhost:3000/v1/callback'
            },
            function(accessToken, refreshToken, expires_in, profile, done) {
                console.log(profile)
                console.log(accessToken)
                console.log(refreshToken)
                console.log(expires_in)
                console.log(done)
                User.findOrCreate({ spotifyId: profile.id }, function(err, user) {
                    return done(err, user);
                });
            }
        )
    );
}
module.exports = hookSpotifyStrategy;