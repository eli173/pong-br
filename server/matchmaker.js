
const WS_PORT = 6789;
const NUM_PLAYERS = 3;
const MS_PER_FRAME = 500;

const WebSocket = require('ws');

const wss = new WebSocket.Server({port: WS_PORT});

const Player = require('./player.js');
const Game = require('./game.js');

players = [];



var manage_incoming = function(ws) {
    var new_player = new Player(ws);
    players.push(new_player);
    if(players.length >= NUM_PLAYERS) {
	game = new Game(players.slice(0, NUM_PLAYERS));
	game.start(MS_PER_FRAME);
	players = players.slice(NUM_PLAYERS);
    }
}

wss.on('connection', manage_incoming);
