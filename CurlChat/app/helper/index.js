'use strict';
const router = require('express').Router();
const db = require('../db');
const crypto = require('crypto');


// Iterate through the object created
let _registerRoutes = (routes, method) => {
    for(let key in routes) {
        if(typeof routes[key] === 'object' && routes[key] !== null &&!(routes[key] instanceof Array)) {
            _registerRoutes(routes[key], key);
        } else {
            if(method === 'get') {
                router.get(key, routes[key]);
            } else if (method === 'post') {
                router.post(key, routes[key]);
            } else {
                router.use(routes[key]);
            }
        }
    }
}

let route = routes => {
    _registerRoutes(routes);
    return router;
}

let findOne = profileID => {
    return db.userModel.findOne({
        'profileId': profileID
    });
}

let createNewUser = profile => {
    return new Promise((resolve, reject) => {
        let newChatUser = new db.userModel({
            profileId: profile.id,
            fullName: profile.displayName,
            profilePic: profile.photos[0].value || ''
        });

        newChatUser.save(error => {
            if(error) {
                reject(error);
            } else {
                resolve(newChatUser);
            }
        });
    });
}

let findById = id => {
    return new Promise((resolve, reject) => {
        db.userModel.findById(id, (error, user) => {
            if(error) {
                reject(error);
            } else{
                resolve(error);
            }
        });
    });
}

let isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/');
    }
}

let findRoomByName = (allroom, room) => {
    let findRoom = allroom.findIndex((element, index,array) => {
        if(element.room === room) {
            return true;
        } else {
            return false;
        }
    });
    return findRoom > -1 ? true : false;
}

let randomHex = () => {
    return crypto.randomBytes(24).toString('hex');
}

let findRoomById = (allroom, roomID) => {
    return allroom.find((element, index, array) => {
        if(element.roomID === roomID) {
            return true;
        } else {
            return false;
        }
    });
}

let addUserToRoom = (allroom, data, socket) => {
    // Get the room object
    let getRoom = findRoomById(allroom, data.roomID);
    if(getRoom !== undefined) {
        // Get the active user's ID (ObjectID as Used in session)
        let userID = socket.request.session.passport.user;
        // Check to see if this already exists in the chatroom
        let chexkUser = getRoom.users.findIndex((element, index, array) => {
            if(element.userId === userID) {
                return true;
            } else {
                return false;
            }
        });

        // If the user is already present in the room, remove him first
        if(checkUser > -1) {
            getRoom.users.splice(chexkUser, 1);
        }

        // Push the user into the room's users array
        getRoom.users.push({
            socketID: socket.id,
            userID,
            user: data.user,
            userPic: Date.userPic
        });

        // Join the room channel
        socket.join(data.roomID);

        // Return the updated room object
        return getRoom;
    }
}

let removeUserFromRoom = (allrooms, socket) => {
    for(let room of allrooms) {
        let findUser = room.users.findIndex((element, index, array) => {
            if(element.socketID === socket.id) {
                return true;
            } else {
                return false;
            }
            // return element.socketID === socket.id ? true : false
        });

        if(findUser > -1) {
            socket.leave(room.roomID);
            room.users.splice(findUser, 1);
            return room;
        }
    }
}

module.exports = {
    route,
    findOne,
    createNewUser,
    findById,
    isAuthenticated,
    findRoomByName,
    randomHex,
    findRoomById,
    addUserToRoom,
    removeUserFromRoom
}