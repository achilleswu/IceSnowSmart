var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ElizaBot = require('eliza/elizabot.js');
var elizas = {}

var parse_message = function (from, to, message) {
	var say = "";
	var eliza = elizas[from];
	if (!eliza) {
		eliza = elizas[from] = new ElizaBot;
		var init = elizas[from].getInitial();
		say = init;
		eliza.transform(message);
	} else {
		say = eliza.transform(message);
	}
	return say;
}

//app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  //socket.broadcast({ announcement: client.sessionId + ' connected' });	
  console.log(socket.sessionId + 'a user connected');
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
	reply = parse_message(socket.sessionId, 0, msg);
	io.emit('chat message', msg);	// send msg to everyone?
	io.emit('chat message', reply);
  });  
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

/*app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});*/


