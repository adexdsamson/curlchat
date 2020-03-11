'use strict';
const express = require('express');
const app = express();
const curlChat = require('./app');
const passport = require('passport');

app.set('port', process.env.PORT || 3000);
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(curlChat.session);
app.use(passport.initialize());
app.use(passport.session());
app.use(require('morgan')('combined', {
    stream: {
        write: message => {
            curlChat.logger.log('info', message);
        }
    }
}));

app.use('/', curlChat.routers);

curlChat.ioServer(app).listen(app.get('port'), () => {
    console.log('Curl chat app running on Port: ', app.get('port'));
});