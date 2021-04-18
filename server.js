//! THIS NEEDS A COMICAL AMOUNT OF REFACTORING, AS SOON AS THE WEBSITE WORKS PLEASE YOU FUCKING IDIOT

const {parse:uuidParse, stringify:uuidStringify, v4:uuidv4} = require('uuid')
const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {removeUserById} = require('./utils/users');
const _ = require('underscore');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

let searchingUsers = []
let onlineUsers = 0;
let foundUsers = []

//I know this variable should really be in my tag matching function but as of right now most of the solutions I can think of are really messy so I'm just gonna
//leave it here until the inspiration to rewrite strikes
let searchingUserIndex = 0;
let oldUserCount;
let userInArray = false;
app.use(express.static(path.join(__dirname, 'public')));
const botName = "ADMIN";


app.get('/chat', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/chat.html'));
})
app.get('/settings', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/settings.html'));
})

//this socket.io used for getting tag matches
io.on('connection', socket =>  {
    console.log(`User ${socket.id} has connected`);
    onlineUsers++;
    io.emit('userCountUpdate', onlineUsers);
    socket.emit('indexID', {sID: socket.id, UUID: uuidv4()});

    let userObject;

    socket.on('tagSubmit', (user = {userID, tags}) => {
        oldSearchingCount = searchingUsers.length;
        if(!userInArray)
        {
            searchingUsers.push(user);
        }
            
        userInArray = true;

        //this ensures that only one instance calls this, because it will only get called on a connection when there was not enough users prior.
        if(searchingUsers.length >= 2 && oldSearchingCount < 2)
        {
            console.log(`Calling matching manager at ${searchingUsers.length} users`)
            matchingManager();
        }
        userObject = user;
        for(let i = 0; i <searchingUsers.length; i++)
        {
            
            console.log(`User: ${searchingUsers[i].userID}, searching for: ${user.tags.join(', ')}`);
        }
        
    });  
    
    socket.on('connectToPartner', partnerUUID => {

    })

    socket.on('chatMessage', (msg) =>{
        const user = getCurrentUser(socket.id);

        io.emit('message', formatMessage(user.username, msg));
    })

    socket.on('disconnect', function() {
        console.log(`User ${socket.id} has disconnected`);
        onlineUsers--;
        io.emit('userCountUpdate', onlineUsers);
        removeUserById(userObject, searchingUsers);
    })
});

function setupChat(user1, user2)
{
    foundUsers.push({sessionUUID: user1.sessionUUID, sID: user1.sID});
    foundUsers.push({sessionUUID: user2.sessionUUID, sID: user2.sID});
    removeUserById(user1.sID, searchingUsers)
    removeUserById(user2.sID, searchingUsers)
    io.to(user1.sID).emit('chatFound', user2.sessionUUID)
    io.to(user2.sID).emit('chatFound', user1.sessionUUID)
    return;
}

//hey kids, wanna see a magic trick? this function has the ability to conjure a stack overflow... out of thin air!
function matchingManager()
{
    let matchFunction = matchUser(searchingUserIndex);
    if(matchFunction == -1)
    {
        searchingUserIndex = clampedIncrement(searchingUserIndex, 0, searchingUsers.length-1);
        //recursion
        matchingManager();
    }
    else
    {
        setupChat(matchFunction.searchingUser, matchFunction.foundUser)
    }
    
    if(searchingUsers.length >= 2)
        matchingManager();
    else
        return;
}

function matchUser(searchingUserIndex)
{
    for(let i = 0; i < searchingUsers.length; i++)
    {
        let sharedTags = _.intersection(searchingUsers[searchingUserIndex].tags, searchingUsers[i].tags)
        //intersection returns an array of all shared items
        if(sharedTags.length > 0 && searchingUsers[i].id !== searchingUsers[searchingUserIndex].id)
        {
            searchingUser =  searchingUsers[searchingUserIndex];
            foundUser = searchingUsers[i];
            //remove and return if sucessful
            searchingUsers.splice(searchingUserIndex, 1);
            searchingUsers.splice(i, 1)
            return {searchingUser, foundUser};
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

//i really need to start moving these util functions into a seperate file, maybe as a node module
function firstDigit(ntn, number){
	var len = Math.floor(Math.log(number) / Math.LN10) - ntn;
  return  ((number / Math.pow(10, len)) % 10) | 0;
}


const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));