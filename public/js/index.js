const tagsController = document.getElementById('tagsController');
const userCount = document.getElementById('userCount');

let sID;
let sessionUUID;
let tags = [];

const socket = io();

socket.on('indexID', IDS => {
    sID = IDS.sID;
    sessionUUID = IDS.sessionUUID
})

//store UUID in session storage
sessionStorage.setItem('sessionUUID', sessionUUID);

socket.on('userCountUpdate', onlineUsers=> {
    userCount.innerText = onlineUsers == 1 ? `1 user is currently online! (That's you!)` : `${Math.ceil(onlineUsers/100)*100} users are currently online!`;
});

socket.on('chatFound', partnerUUID => {
    sessionStorage.setItem('partnerUUID', partnerUUID)
})

tagsController.addEventListener('submit', e =>  {
    e.preventDefault();

    var tagsUnfiltered = String(e.target.elements.tags.value);
    tags = parseTags(tagsUnfiltered)
    console.log(window.location.href)
    
    

    socket.emit('tagSubmit', {sID: sID, sessionUUID: sessionUUID, tags: tags});
});

function parseTags(tagsUnfiltered)
{
    return tagsUnfiltered.split(",").map(item => item.trim());
} 

