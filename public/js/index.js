const tagsController = document.getElementById('tagsController');
const userCount = document.getElementById('userCount');

let ID;
let tags = [];

const socket = io();

socket.on('ID', IDInput => {
    ID = IDInput;
    console.log("User ID is " + ID)
})

socket.on('userCountUpdate', onlineUsers=> {
    userCount.innerText = onlineUsers == 1 ? `1 user is currently online! (That's you!)` : `${Math.ceil(onlineUsers/100)*100} users are currently online!`;
});

tagsController.addEventListener('submit', e =>  {
    e.preventDefault();

    var tagsUnfiltered = String(e.target.elements.tags.value);
    tags = parseTags(tagsUnfiltered)
    console.log(window.location.href)
    
    

    socket.emit('tagSubmit', {userID: ID, tags: tags});
    window.location+='chat';
});

function parseTags(tagsUnfiltered)
{
    return tagsUnfiltered.split(",").map(item => item.trim());
} 

