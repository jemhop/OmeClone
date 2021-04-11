const tagsController = document.getElementById('tags-controller');

let ID;
let tags = [];

const socket = io();

socket.on('ID', IDInput => {
    ID = IDInput;
    console.log("User ID is " + ID)
})

tagsController.addEventListener('submit', e =>  {
    e.preventDefault();

    var tagsUnfiltered = e.target.elements.tags.value;
    tags[0] = tagsUnfiltered;

    console.log(tags[0]);
    console.log("-N.B- Remember to implement filtering of tags into multiple tags for use as seperate individual matchmaking queries fuckhead -N.B-")

    e.target.elements.tags.value = '';

    socket.emit('tagSubmit', {userID: ID, tags: tags[0]});
});

