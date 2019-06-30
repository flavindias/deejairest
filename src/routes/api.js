'use strict';
var router = require('express').Router();

const config = require('../config/config');
const userController = require('../../src/app/controllers/userController');
const roomController = require('../../src/app/controllers/roomController');
const playlistController = require('../../src/app/controllers/playlistController');

const scope = [
    "user-read-recently-played",
    "user-top-read",
    "user-library-modify",
    "user-library-read",
    "user-read-email",
    "user-read-birthdate",
    "user-read-private",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-currently-playing",
    "user-follow-read",
    "user-follow-modify",
    "playlist-read-private",
    "playlist-modify-public",
    "playlist-modify-private",
    "playlist-read-collaborative",
    "app-remote-control",
    "streaming"
]

var APIRoutes = function(passport) {

    /*
        Para autenticação direta via API sem a necessidade do Front-END
     */

    //Auth
    router.get(
        '/auth/spotify',
        passport.authenticate('spotify', {
            scope: scope,
            // showDialog: true
        }),
        function(req, res) {
            // The request will be redirected to spotify for authentication, so this
            // function will not be called.
        }
    );
    //Callback URL
    router.get(
        '/callback',
        function(req, res) {
            // console.log(req)
            console.log(res)
            res.status(200).json({
                'code': req.query.code,
                'access_token': req.query.access_token
            })
            // res.redirect('/');
        }
    );
    /*
        User methods
     */
    router.get(
        '/users/topMusic',
        passport.authenticate('bearer', { session: false }),
        userController.topSongs
    )

    /*
        Room methods
     */
    router.get('/rooms',
        passport.authenticate('bearer', { session: false }),
        roomController.index
    );

    router.post('/rooms',
        passport.authenticate('bearer', { session: false }),
        roomController.create
    );

    router.post('/rooms/:code',
        passport.authenticate('bearer', { session: false }),
        roomController.join
    );

    router.post('/rooms/:code/quit',
        passport.authenticate('bearer', { session: false }),
        roomController.quit
    );

    router.get('/rooms/:code',
        passport.authenticate('bearer', { session: false }),
        roomController.view
    );

    router.delete('/rooms/:code/:user_id',
        passport.authenticate('bearer', { session: false }),
        roomController.remove
    );

    /*
        Playlist methods
    */

    router.get('/playlists/:id',
        passport.authenticate('bearer', { session: false }),
        playlistController.songs
    );

    router.post('/playlists/:id/vote',
        passport.authenticate('bearer', { session: false }),
        playlistController.vote
    );

    router.post('/playlists/:id/sync',
        passport.authenticate('bearer', { session: false }),
        playlistController.sync
    );

    //Redirect to home

    router.get('/', function(req, res) {
        res.status(418).json({ 'message': 'Welcome' });
    });
    router.get('/*', function(req, res) {
        res.status(404).json({ 'message': 'URI is not valid.' });
    });
    router.post('/*', function(req, res) {
        res.status(404).json({ 'message': 'URI is not valid.' });
    });
    router.put('/*', function(req, res) {
        res.status(404).json({ 'message': 'URI is not valid.' });
    });
    router.delete('/*', function(req, res) {
        res.status(404).json({ 'message': 'URI is not valid.' });
    });


    return router;

}
module.exports = APIRoutes;