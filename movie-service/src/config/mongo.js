const MongoClient = require('mongodb').MongoClient;

const getMongoUrl = (options) => {

    const url = options.servers.reduce((prevStr, mongoServer)=>{
        return prevStr+`${mongoServer},`;
    },`mongodb://${options.auth.user}:${options.auth.pass}@`);

    return `${url.substr(0, url.length-1)}/?authSource=${options.authenticationDB}`;
}

const connect = (options, mediator) => {

    mediator.once('boot.ready', () => {

        MongoClient.connect( getMongoUrl(options), options.parameters, (err, client)=>{

            if(err){

                mediator.emit('db.error', err);
                return;
            }

            const db = client.db(options.db);
            mediator.emit('db.ready', db);
        });
    });
}

module.exports.connect = connect;