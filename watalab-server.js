var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(process.env.PORT || 80);

app.use(express.static(__dirname + '/public'));

var recognizer_id_counter = 1;
io.on('connection', function (socket) {
	var r_id = recognizer_id_counter ++;
	console.log("client connected (id: " + r_id + ")");

	socket.on('speech recognized', function(data) {
		console.log("recognition result received (id: " + r_id + ")");
		data.recognizer_id = r_id;
		socket.broadcast.emit('recognition result', data);
	});

	// @todo add an unique data.recognizer_id
	// for debug!!
	// var data = {
	// 	recognizer_id: 1,
	// 	results: [
	// 		{isFinal: true, transcript: "わたしはりんごアレルギーです"},
	// 		{isFinal: true, transcript: "だからりんご狩りにいってもりんごが食べられない"},
	// 		{isFinal: false, transcript: "つらいなあ"}
	// 	]
	// }
	
	// setInterval(function() {
	// 	socket.emit('recognition result', data);
	// }, 1000);

	// setInterval(function() {
	// 	data.results.push({isFinal: false, transcript: "つらい"});
	// }, 3500);
});
