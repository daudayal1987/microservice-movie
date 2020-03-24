const {ObjectID} = require('mongodb');
const {dbSettings, serverSettings} = require('./config.js');
const db = require('./mongo.js');

module.exports = {
    dbSettings,
    serverSettings,
    db,
    ObjectID
};