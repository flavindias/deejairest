#!/usr/bin/env node
// const mongoose = require('mongoose');
const app = require('./app');
// mongoose.connect('mongodb://localhost:27017/deejai',{
//     useNewUrlParser: true
// })

app.listen(process.env.PORT || 3000, () => {
    console.log(`deejAI API Running at port: ${process.env.PORT || 3000}`)
});