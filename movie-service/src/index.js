'use strict'

const {EventEmitter} = require('events');
const server = require('./server/server.js');
const repository = require('./repository/repository.js');
const config = require('./config');
const mediator = new EventEmitter();

console.log("-----Movie Server------");
console.log("Connecting to movie repository");

process.on('uncaughtException', (err)=>{
    console.log('uncaught exception found', err);
});

process.on('unhandledRejection', (err)=>{
    console.log('uncaught rejection found', err);
});

mediator.on('db.ready', (db)=>{

    let rep;
    repository.connect(db)
        .then((repo)=>{
            rep = repo;
            console.log('Repository connected, Starting server');

            return server.start({
                repo,
                port: config.serverSettings.port 
            });
        })
        .then((app)=>{
            console.log(`Server started successfully on port ${config.serverSettings.port}`);
            app.on('close', () => {

                rep.disconnect();
            });
        })
});

mediator.on('db.error', (err)=>{
    console.log("Error on connecting to db", err);
})

config.db.connect(config.dbSettings, mediator);
mediator.emit('boot.ready');
