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

//I know this variable should really be in my tag matching function but as of right now most of the solutions I can think of are really messy so I'm just gonna
//leave it here until the inspiration to rewrite strikes
let searchingUserIndex = 0;

app.use(express.static(path.join(__dirname, 'public')));
const botName = "ADMIN";

io.on('connection', socket =>  {
    console.log('Reached')
    onlineUsers++;
    io.emit('userCountUpdate', onlineUsers);
    socket.emit('ID', socket.id);

    socket.on('tagSubmit', (user = {userID, tags}) => {
        if(searchingUsers.length >= 2) 
        {

        }
        searchingUsers.push(user);

        for(let i = 0; i <searchingUsers.length; i++)
        {
            console.log(`User: ${searchingUsers[i].userID}, searching for: ${searchingUsers[i].tags}`);
        }
        
    });     

    socket.on('chatMessage', (msg) =>{
        const user = getCurrentUser(socket.id);

        io.emit('message', formatMessage(user.username, msg));
    })
});


//super crude solution, this function is just Always running and checking itself 
function matchingManager()
{
    if(searchingUsers.length < 2) matchingManager();
    let matchFunction = matchUser(searchingUserIndex);
    if(matchFunction == -1)
    {
        searchingUserIndex = clampedIncrement(searchingUserIndex, 0, searchingUsers.length-1);
        //recursion
        matchingManager();
    }
    else
    {
        return matchFunction;
    }
}

function matchUser()
{
    for(let i = 0; i < searchingUsers.length; i++)
    {
        let sharedTags = _.intersection(userTags, searchingUsers[i].tags)
        //intersection returns an array of all shared items
        if(sharedTags.length > 0 && searchingUsers[i].id !== userID)
        {
            //remove and return if sucessful
            searchingUsers.splice(searchingUserIndex, 1);
            searchingUsers.splice(i, 1)
            return {searchingID: userID, foundID: searchingUsers[i].id};
        }
    }
    return -1;
}

//this function exists because im too lazy to increment and then call a clamp, i think ill replace it in the future but it works for now
function clampedIncrement(value, min, max)
{
    value++;
    if(value > max)
        value = min;
    else if(value < min)
        value = max;
    return value;
}

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));