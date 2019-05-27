const routes = require('express').Router();

const UserController = require('../src/app/controllers/userController');

var APIRoutes = function(passport) {

    //Auth
    routes.get(
        '/auth/spotify',
        passport.authenticate('spotify', {
            scope: [
                'user-read-email',
                'user-read-private'],
            showDialog: true
        }),
        function(req, res) {
            console.log(res)
            // The request will be redirected to spotify for authentication, so this
            // function will not be called.
        }
    );

    routes.get(
        '/user/me',
        passport.authenticate('spotify', {
            scope: [
                'user-read-email',
                'user-read-private'],
            showDialog: true
        }),
        function(req, res) {
            console.log(res)
            // The request will be redirected to spotify for authentication, so this
            // function will not be called.
        }
    );
    routes.get(
        '/user/me',
        passport.authenticate('spotify', { failureRedirect: '/login' }),
        UserController.topTracks
    );
    routes.get(
        '/callback',
        passport.authenticate('spotify', { failureRedirect: '/login' }),
        function(req, res) {
            res.redirect('/');
        }
    );

    routes.get('/login', function(req, res) {
        // res.render('login.html', { user: req.user });
        res.status(200).json({message: 'Login'})
    });



    routes.get('/',  function (req, res) {
        res.status(404).json({'message': 'Welcome'});
    });
    routes.get('/*',  function (req, res) {
        res.status(404).json({'message': 'URI is not valid.'});
    });
    routes.post('/*',  function (req, res) {
        res.status(404).json({'message': 'URI is not valid.'});
    });
    routes.put('/*',  function (req, res) {
        res.status(404).json({'message': 'URI is not valid.'});
    });
    routes.delete('/*',  function (req, res) {
        res.status(404).json({'message': 'URI is not valid.'});
    });

    return routes
}
module.exports = APIRoutes;