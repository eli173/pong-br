

const c = require('./constants.js');

const health = require('./health.js');

const WebSocket = require('ws');

const wss = new WebSocket.Server({port: c.WS_PORT});

const Player = require('./player.js');
const Game = require('./game.js');

const Robot = require('./robot.js');

var players = [];

var timeout = null; // for adding robots timer

var manage_incoming = function(ws) {
    // health check, closes off everything
    if(health.isOK()) {
	if(ws.readyState == ws.OPEN) {
	    ws.send("busy");
	}
	ws.close(1013,"busy");
	return;
    }
    
    var new_player = new Player(ws);
    players.push(new_player);
    if(players.length >= c.NUM_PLAYERS) {
	game = new Game(players.slice(0, c.NUM_PLAYERS));
	health.inc();
	game.start(c.MS_PER_FRAME);
	players = players.slice(c.NUM_PLAYERS); // just security in case >n connections at once
	// i think js lack-of-threading makes it impossible for that to happen though
	clearTimeout(timeout);
	timeout = null;
    }
    else if(timeout == null) {
	setTimeout(robot_adder, c.ROBO_TIME);
    }
}

// okay, in this space, i wanna have the code to check for adding robots and stuff
var robot_adder = function() {
    while(players.length < c.NUM_PLAYERS) {
	players.push(new Robot());
    }
    game = new Game(players.slice()); // array copy
    health.inc();
    game.start(c.MS_PER_FRAME);
    players = [];
}
//

wss.on('connection', manage_incoming);

