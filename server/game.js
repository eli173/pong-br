
const GameState = require('./gamestate.js');

function Game(players) {
    this.players = players;
    this.state = new GameState();
    this.timeout = null;
}

Game.prototype.start = function(ms) {
    this.timeout = setInterval(this.getNextFrame, ms);
}

Game.prototype.getNextFrame = function() {
    // 
    var inputs = this.players.map(function(p) {return p.get_status();});
    this.state.updateState(inputs);
    var state = this.state.getState();
    for(var i=0; i<this.players.length;i++) {
	this.players[i].socket.send(i.toString() + ", " + state);
    }
}


module.exports = Game;
