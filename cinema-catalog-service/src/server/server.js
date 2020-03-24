'use strict'

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const catalogAPI = require('../api/cinema-catelog.js');

const start = (options) => {

    return new Promise((resolve, reject)=>{

        if(!options.repo){
            reject(new Error('Connected repo is not given'));
        }

        if(!options.port){
            reject(new Error('Please supply port to run the server'));
        }

        const app = express();
        app.use(morgan('dev'));
        app.use(helmet());

        catalogAPI(app, options);

        app.use((err, req, res, next)=>{
            reject(new Error('Something went wrong ' + err));
            res.status(500).send('Something went wrong');
        });

        const server = app.listen(options.port, () => {

            resolve(server);
        });
    });
}

module.exports.start = start;