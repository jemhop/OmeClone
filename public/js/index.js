const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
let ID;
let tags = [];

//Get username and room from URL
/*const{username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});*/
const username = "lol"
const room = "test"

const socket = io();

socket.on('ID', IDInput => {
    ID = IDInput;
    console.log("User ID is " + ID)
})
