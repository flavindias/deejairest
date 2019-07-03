require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const express = require('express');
const passport = require('passport');
const cors = require('cors');

const hookBearerStrategy = require('./app/middleware/passportBearerStrategy');

class AppController {
    constructor() {
        this.express = express();
        this.express.use(cors());
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(morgan('dev'));
        this.express.use(passport.initialize());
        hookBearerStrategy(passport);

        this.routes();
        this.middlewares();
    }

    middlewares () {

        this.express.use(express.json());
        this.express.use(helmet());
        this.express.disable('x-powered-by');
        this.express.set('trust proxy', 1) // trust first proxy

    }

    routes () {
        // 8. Rota inicial.
        this.express.all('/*', function(req, res, next) {
            var oneof = false;
            if (req.headers.origin) {
                res.header('Access-Control-Allow-Origin', req.headers.origin);
                oneof = true;
            }
            if (req.headers[ 'access-control-request-method' ]) {

                res.header('Access-Control-Allow-Methods', req.headers[ 'access-control-request-method' ]);
                oneof = true;
            }
            if (req.headers[ 'access-control-request-headers' ]) {
                res.header('Access-Control-Allow-Headers', req.headers[ 'access-control-request-headers' ]);
                oneof = true;
            }
            if (oneof) {
                res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
            }

            // intercept OPTIONS method
            if (oneof && req.method == 'OPTIONS') {
                res.sendStatus(200);
            }
            else {
                next();
            }
        });

        this.express.get('/', function(req, res, next) {
            // Handle the get for this route
            res.status(418).json({ 'message': 'Welcome' });
        });

        this.express.post('/', function(req, res, next) {
            // Handle the post for this route
            res.status(418).json({ 'message': 'Welcome' });
        });
        this.express.put('/', function(req, res, next) {
            // Handle the post for this route
            res.status(418).json({ 'message': 'Welcome' });
        });
        this.express.delete('/', function(req, res, next) {
            // Handle the post for this route
            res.status(418).json({ 'message': 'Welcome' });
        });


        // Bundle API routes.
        this.express.use('/v1', require('./routes/api')(passport));

        // Pegando todas as rotas.
        this.express.get('*', function(req, res) {
            res.status(200).json({ 'message': 'Welcome' });
        });


    }
}

module.exports = new AppController().express