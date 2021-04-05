const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

const botName = "ADMIN";

io.on('connection', socket =>  {

    socket.on('joinRoom', ({username, room}) => {
        const user = userJoin(socket.id, username, room)

        socket.join(user.room);
        //to connecting client
        socket.emit('message', formatMessage(botName, `Welcome to OmegClone, ${username}!`));

        //to all other clients in room
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${username} has joined the room! `));

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    })

     
     
   
    socket.on('disconnect', () =>{
        const user = userLeave(socket.id);

        if(user) {
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has disconnected`)); //goes to all
        }
        
    })

    socket.on('chatMessage', (msg) =>{
        const user = getCurrentUser(socket.id);

        io.emit('message', formatMessage(user.username, msg));
    })
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));