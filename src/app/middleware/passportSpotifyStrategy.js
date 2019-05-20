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
                callbackURL: 'http://localhost:8888/auth/spotify/callback'
            },
            function(accessToken, refreshToken, expires_in, profile, done) {
                console.log(profile)
                // User.findOrCreate({ spotifyId: profile.id }, function(err, user) {
                //     return done(err, user);
                // });
            }
        )
    );
}
module.exports = hookSpotifyStrategy;