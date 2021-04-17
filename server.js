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
        if(searchingUsers.length >= 2) 
        {
            recursiveMatch();
        }
        searchingUsers.push(user);

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


//this code is so bad, like genuinely, really, actually, genuinely so bad
//please, please, please, future me majorly rewrite it
//its also SO fucking slow (i believe it's O(N) for a single user and O(N^2) for the whole list of searching users? idk)
function matchingManager()
{
    //this is badbadbadbadbadbadbadbadbadbadbadbad but i wanted to keep business logic outside of my matching function
    let currentUserIndex = 0;
    currentUser = searchingUsers[currentUserIndex]
    matchResult = recursiveMatch(currentUserIndex)
    if(matchResult.isArray())
    {
        return matchResult;
    }
    else if(!matchResult.isArray() && searchingUsers.length >= 2)
    {
        recursiveMatch(currentUserIndex)
    }

}

function recursiveMatch(currentUserIndex)
{
    //this bit is decent
    currentUser = searchingUsers[0].id;
    userTags = searchingUsers[0].tags
    for(let i = 0; i < searchingUsers.length; i++)
    {
        let sharedTags = _.intersection(userTags, searchingUsers[i].tags)
        //intersection returns an array of all shared items
        if(sharedTags.length > 0)
        {
            //remove and return if sucessful
            searchingUsers.splice(currentUser, 1);
            return sharedTags;
        }
    }
    //else move onto the next user in the array
    return currentUserIndex

}


const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));