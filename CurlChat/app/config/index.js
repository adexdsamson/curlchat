'use strict';

if(process.env.NODE_ENV === 'production') {

    let redisURI = require('url').parse(process.env.REDIS_URL);
    let redisPassword = redisURI.auth.split(':')[1];
    module.exports = {
        host: process.env.host || "",
        dbURI: process.env.dbURI,
        sessionSecret: process.env.sessionSecret,
        fb: {
            clientID : process.env.clientID,
            clientSecret: process.env.clientSecret,
            callbackURL: process.env.host + "/auth/facebook/callback",
            profileFields: ['id', 'displayName', 'photos']
        },
        redis: {
            host: redisURI.hostname,
            port: redisURI.port,
            password: redisPassword
        }
    }
} else {
    module.exports = require('./development.json');
}