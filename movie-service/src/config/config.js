// simple configuration file

// database parameters
const dbSettings = {
    db: process.env.DB || 'movies',
    auth: {
        user: process.env.DB_USER || 'dau',
        pass: process.env.DB_PASS || 'default'
    },
    servers: (process.env.DB_SERVERS) ? process.env.DB_SERVERS.split(' ') : [
      '127.0.0.1:27017',
      '127.0.0.1:27018',
      '127.0.0.1:27019'
    ],
    parameters: {
      w: 'majority',
      wtimeout: 10000,
      j: true,
      readPreference: 'secondaryPreferred',
      native_parser: false,
    //   autoReconnect: true,
      poolSize: 10,
    //   socketoptions: {
    //     keepAlive: 300,
    //     connectTimeoutMS: 30000,
    //     socketTimeoutMS: 30000
    //   },
      ha: true,
      haInterval: 10000,
      replicaSet: process.env.DB_REPLS || 'rs1',
      useUnifiedTopology: true
    },
    authenticationDB: process.env.AUTH_DB || 'admin'
  }
  
  // server parameters
  const serverSettings = {
    port: process.env.PORT || 3001
  }
  
  module.exports = Object.assign({}, { dbSettings, serverSettings })