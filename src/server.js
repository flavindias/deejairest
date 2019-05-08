#!/usr/bin/env node

const app = require('./app');


app.listen(process.env.PORT || 3000, () => {
    console.log(`VizioMed API Running at port: ${process.env.PORT || 3000}`)
});
