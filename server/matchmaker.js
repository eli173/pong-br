

const c = require('./constants.js')

const WebSocket = require('ws');

const wss = new WebSocket.Server({port: c.WS_PORT});

const Player = require('./player.js');
const Game = require('./game.js');

players = [];

timeout = null;

var manage_incoming = function(ws) {
    var new_player = new Player(ws);
    players.push(new_player);
    if(players.length >= c.NUM_PLAYERS) {
	game = new Game(players.slice(0, c.NUM_PLAYERS));
	game.start(c.MS_PER_FRAME);
	players = players.slice(c.NUM_PLAYERS);
    }
}

wss.on('connection', manage_incoming);

