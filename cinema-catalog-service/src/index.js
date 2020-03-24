'use strict'

const {EventEmitter} = require('events');
const server = require('./server/server.js');
const repository = require('./repository/repository.js');
const config = require('./config');

const mediator = new EventEmitter();


console.log('------Cinema Catalog Service------');
console.log('Connecting to repository');

process.on('uncaughtException', (err)=>{

    console.log('Caught an uncaughtException ', err);
});

process.on('unhandledRejection', (err)=>{

    console.log('Handled an unhandledRejection ', err);
});

mediator.on('db.ready', (db)=>{

    let rep;
    repository.connect({
        db,
        ObjectID: config.ObjectID
    }).then((repo)=>{
        console.log('Connected to repository, Starting server');

        rep = repo;
        return server.start({
            port: config.serverSettings.port, 
            repo
        })
    }).then((app)=>{

        console.log(`Server started successfully, running on port ${config.serverSettings.port}`);
        app.on('close', ()=>{

            rep.disconnect();
        });
    });
});

mediator.on('db.error', (err)=>{

    console.log('Error on connecting to db', err);
});

config.db.connect(config.dbSettings, mediator);
mediator.emit('boot.ready');