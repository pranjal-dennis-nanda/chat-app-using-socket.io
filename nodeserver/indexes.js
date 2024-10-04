const io = require('socket.io')(8000,{
    cors:{
        origin:"*"
    }
});
const users={};
io.on('connection',socket=>{
    socket.on('new-user-joined',name=>{
        console.log("New User:",name);
         users[socket.id]=name;
         socket.emit('existing-users', Object.values(users));
       socket.broadcast.emit('user-joined',name);
    });
    socket.on('send',(message)=>{
        socket.broadcast.emit('recieve',{message:message,name:users[socket.id]});
    });
    socket.on('disconnect',()=>{
        socket.broadcast.emit('leave',users[socket.id]);
        delete users[socket.id];
    })
})
 