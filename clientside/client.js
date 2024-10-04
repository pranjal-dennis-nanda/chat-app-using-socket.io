const socket = io('http://localhost:8000');
const form = document.getElementById('send-container');
const msginput = document.getElementById('messageInp');
const msgcontainer = document.querySelector('.container');
const names = prompt("Enter your name");
var audio=new Audio('./ting.mp3');
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    msgcontainer.appendChild(messageElement);
    msgcontainer.scrollTop=msgcontainer.scrollHeight;
    messageElement.addEventListener('dblclick',(e)=>{
        e.stopPropagation();
        if(msgcontainer.contains(messageElement))
        {
                msgcontainer.removeChild(messageElement);
        }
    })
    if(position=='left')
    {
        audio.play();
    }
};

// Send the new user name to the server
if (names) {
    console.log("User name:", names);
    socket.emit('new-user-joined', names);
}

// Listen for the 'existing-users' event and display the list of existing users
// socket.on('existing-users', users => {
//     users.forEach(user => {
//         append(`${user} is already in the chat`, 'right');
//     });
// });
socket.on('existing-users',users=>{
        users.forEach((user)=>{
                append(`${user} already in the chat`,'right');
        })
})

// Listen for the 'user-joined' event and display the name of the newly joined user
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right');
});
form.addEventListener('submit',(e)=>{
        e.preventDefault();
        e.stopPropagation();
        const msgin=msginput.value;
        msginput.value=" ";
        append(`You:${msgin}`,'right');
        socket.emit('send',msgin);
})
socket.on('recieve',data=>{
        append(`${data.name}:${data.message}`,'left');
})
socket.on('leave',name=>{
        append(`${name} left the chat`,'right');
})
