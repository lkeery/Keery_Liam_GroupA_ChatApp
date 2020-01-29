var express = require('express');
var app = express();

const io = require('socket.io')();

const port = process.env.PORT || 3030;

// tell express where our static files are (js, images, css etc)
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

const server = app.listen(port, () => {
    console.log(`app is running on port ${port}`);
});

io.attach(server);

io.on('connection', function(socket) {
    console.log('User Connected');
    socket.emit('connected', { sID: socket.id, message: "new connection" });

    socket.on('chat_message', function(msg) {
        console.log(msg);

        io.emit('new_message', { id: socket.id, message: msg });
    })

    socket.on('disconnect', function() {
        console.log('User Disconnected');
    })
})