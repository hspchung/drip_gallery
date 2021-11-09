//Set up express and app; serve public folder
let express = require('express');
let app = express();
app.use('/', express.static('public'));

//Require http; set up server
let http = require('http');
let server = http.createServer(app);
let port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log('server listening at :' + port);
});

//Set up socket.io
let io = require('socket.io');
io = new io.Server(server);

//Server-side Socket Connection & Disconnection
io.sockets.on('connection', function(socket){
    console.log('new user: ' + socket.id);

    //Server-side 'On' Event
    socket.on('data', function(data){
        console.log('data received');
        console.log(data);

        //Server-side 'Emit' Event
        io.sockets.emit('data', data);
    });


    socket.on('disconnect', function(){
        console.log('client has disconnected: ' + socket.id);
    });
});

//Private namespace socket connections
let private = io.of('/private');

private.on('connection', (socket)=> {
    console.log("We have a new client: " + socket.id);

    //Listen for room name
    socket.on('room-name', data => {
        
        //Socket to room
        socket.join(data.room);

        //Room property to socket object
        socket.room = data.room;

        //Welcome message to new clients only
        let welcomeMsg = "Welcome to " + data.room + " room!";
        socket.emit('joined', {msg: welcomeMsg});

    });

    socket.on('data', (data) => {
        console.log(data);

        //Only draws in private room
        private.to(socket.room).emit('data', data);
    });

    socket.on('disconnect', () => {
        //Disconnect message
        console.log(`Client ${socket.id} has disconnected and left room ${socket.room}`);

        socket.leave(socket.room);
    });
});