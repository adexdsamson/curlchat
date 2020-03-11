'use strict';
const config = require('../config');
const Mongoose = require('mongoose').connect(config.dbURI);
const logger = require('../logger');

//Log an error if the connection fails
Mongoose.connection.on('error', error => {
    logger.log('error', 'Mongoose connection error: ' + error);
});

const curlUser = new Mongoose.Schema({
    profileId: String,
    fullName: String,
    profilepic: String
});

let userModel = Mongoose.model('curlUser', curlUser);

module.exports = {
    Mongoose,
    userModel
}