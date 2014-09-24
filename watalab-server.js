var express = require('express');
var app = express();
var fs = require('fs');
var https = require('https');
var options = {
    key: fs.readFileSync('./ssl/raw_server.key'), // 秘密鍵
    cert: fs.readFileSync('./ssl/server.crt'), // 公開鍵
    passphrase: 'watalab'
};
var server = require('http').Server(app);
var https_server = https.createServer(options, app);
var io = require('socket.io')(https_server);

console.log("http", process.env.PORT || 80, "https", process.env.HTTPS_PORT || 443);
server.listen(process.env.PORT || 80);
https_server.listen(process.env.HTTPS_PORT || 443);

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
