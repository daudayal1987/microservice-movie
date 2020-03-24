'use strict'

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const movieAPI = require('../api/movies');

const start = (options) => {

    return new Promise((resolve, reject)=>{

        if(!options.repo){
            reject(new Error("Connected repository not given"));
        }

        if(!options.port){
            reject(new Error("Port not specified to run server"));
        }

        const app = express();
        app.use(morgan('dev'));
        app.use(helmet());

        movieAPI(app, options);

        app.use((err, req, res, next)=>{
            reject(new Error('Something went wrong err ' + err));
            res.status(500).send("Something went wrong");
        });

        const server = app.listen(options.port, () => {

            resolve(server);
        });
    })
}

module.exports.start = start;