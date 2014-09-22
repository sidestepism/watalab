var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(process.env.PORT || 80);

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
	socket.on('speech recognized', function(data) {
		socket.broadcast.emit('recognition result', data);
	})
});
