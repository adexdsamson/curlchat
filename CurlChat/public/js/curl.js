'use strict';
$(() => {
    let socket = io('<%= host %>' + '/chatter', {
        transports: ['websocket']
    });
    let roomID = '<%= roomID %>';
    let user = '<%= user.fullName %>';
    let userPic = '<%= user.profilePic %>';
    let chatUsers = $('.chatUsers');
    let chatInput = $("input[name='userInput']");
    let chatMessagesDiv = $('.chatMessages');
    let filePicker = $('#uploadFile');

    socket.on('connect', () => {
        socket.emit('join', {
            roomID,
            user,
            userPic
        });
    });

    let userList = user => {
        return `<div class="userBlock">
                <div class="userPic"><img src="${user.userPic}" alt="${user.user}"></div>
                <div class="cuserName">${user.user}</div>
            </div>`;
    }

    socket.on('updateUsersList', data => {
        let parsedData = JSON.parse(data);
        let usersListData = '';
        for(let user of parsedData) {
            usersListData += userList(user);
        }
        chatUsers.html('').html(usersListData);
    });

    let updateFeed = (userPic, message) => {
        let template = `<div class="chatBlock">
                            <div class="userPic"><img src="${userPic}"></div>
                            <div class="chatMsg">${message}</div>
                        </div>`;
        $(template).hide().prependTo(chatMessagesDiv).slideDown(200);
    }

    chatInput.on('keyup', function(evt) {
        evt.preventDefault();
        let messageFld = $(this);
        if(evt.which === 13 && messageFld.val() !== '') {
            socket.emit('newMessage', {
                roomID,
                user,
                userPic,
                message: messageFld.val()
            });
            // Update the local feed
            updateFeed(userPic, messageFld.val());
            messageFld.val('');
        }
    });

    socket.on('inMessage', data => {
        let parsedData = JSON.parse(data);
        updateFeed(parsedData.userPic, parsedData.message);
    });

    filePicker.on('click', function(evt) {
        cloudinary.openUploadWidget({
            cloud_name: 'dikniqpsy',
            upload_preset: 'xwa7iuys'
        }, (error, result) => {
            if(!error) {
                let tmp = '';
                for(let img of result) {
                    tmp += `<img src="${img.url}">`
                }
                updateFeed(userPic, tmp);

                socket.emit('newMessage', {
                    roomID,
                    user,
                    userPic,
                    message: tmp
                });

            }
        });
    });

});
