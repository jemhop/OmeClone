const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const username = 'Tester';
const room = 'testRoom';
const socket = io();
let chatPartner = sessionStorage.getItem('partnerUUID')
let sessionUUID = sessionStorage.getItem('sessionUUID')
let sID;
let partnerSID;

//Message from server
socket.on('message', message =>{
    console.log(message);
    outputMessage(message);

    chatMessages.scrollTop = chatMessages.scrollHeight; 
});

socket.emit('connectToPartner', partnerUUID);

socket.on('connectResponse', socketIDS =>{
    
})

//Message submit
chatForm.addEventListener('submit', e =>  {
    e.preventDefault();

    //get message 
    const msg = e.target.elements.msg.value;

    //send to server
    socket.emit('chatMessage', msg);

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});



//Output message to DOM
function outputMessage(message)
{
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class ="meta">${message.username} <span>${message.time}</span></p><p class="text">${message.text}</p>`;
    document.querySelector('.chat-messages').appendChild(div);
}