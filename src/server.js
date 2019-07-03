#!/usr/bin/env node

const app = require('./app');
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use((req, res, next) => {
    req.io = io;
    return next();
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`deejAI API Running at port: ${process.env.PORT || 3000}`)
});