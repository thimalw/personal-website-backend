const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// load environment variables from .env file
require('dotenv').config();

const app = express();

// connect to mongodb and provide the express setup as callback function
mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, err => {
    // check for database connection errors and abort (throw) if an error has occured
    if (err) {
        throw new Error('Database connection failed! err: ' + err);
    }

    // load middleware
    app.use(cors);
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    // setup routes
    app.use('/v1', require('./src/routes'));

    // start express server
    app.listen(process.env.THIMAL_API_PORT, () => {
        console.log('Server is listening on port ' + process.env.THIMAL_API_PORT);
    });
});
