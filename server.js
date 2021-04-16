//todo: comment your code fuckhead

const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');
const _ = require('underscore');

const app = express();
const server = http.createServer(app);
const io = socketio(server);


let searchingUsers = []
let onlineUsers = 0;

app.use(express.static(path.join(__dirname, 'public')));

const botName = "ADMIN";

io.on('connection', socket =>  {
    onlineUsers++;
    io.emit('userCountUpdate', onlineUsers);
    socket.emit('ID', socket.id);

    socket.on('tagSubmit', (user = {userID, tags}) => {
        if(searchingUsers.length < 2) 
        {
            recursiveMatch();
        }
        searchingUsers.push(user);
        console.log(user.tags);
        console.log(user.userID);

        for(let i = 0; i <searchingUsers.length; i++)
        {
            console.log(`User: ${searchingUsers[i].userID}, searching for: ${searchingUsers[i].tags}`);
        }
        
    });     
   
    socket.on('disconnect', () =>{
        const user = userLeave(socket.id);
        onlineUsers--;
        if(user) {
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has disconnected`)); //goes to all
        }
        
    })

    socket.on('chatMessage', (msg) =>{
        const user = getCurrentUser(socket.id);

        io.emit('message', formatMessage(user.username, msg));
    })
});

function recursiveMatch()
{
    currentUserIndex;
    currentUser = searchingUsers[0].id;
    userTags = searchingUsers[0].tags
    if(searchingUsers.length > 1)
    {
        recursiveMatch()
    }
}


const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));