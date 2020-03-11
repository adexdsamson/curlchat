'use strict';
const passport = require('passport');
const config = require('../config');
const facebookStrategy = require('passport-facebook').Strategy;
const h = require('../helper');
const logger = require('../logger');

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        h.findById(id)
            .then(user => done(null, user))
            .catch(error => logger.log('error', 'Error when deserializing the user' + error));
    });
    
    let authProcessor = (accessToken, refreshTokenn, profile, done) => {
        // find a user in the local db using profile.id
        h.findOne(profile.id)
            .then(result => {
                if(result) {
                    done(null, result);
                } else {
                    h.createNewUser(profile)
                        .then(newChatUser => done(null, newChatUser))
                        .catch(error => logger.log('error', 'Error when creating a new user' + error));
                }
            });
        
    }

    passport.use(new facebookStrategy(config.fb, authProcessor));
   
}