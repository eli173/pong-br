
const GameState = require('./gamestate.js');

function Game(players) {
    this.players = players;
    for(var i=0; i<players.length; i++) {
	this.players[i].id = i;
    }
    this.state = new GameState(this.players.length);
    this.timeout = null;
}

Game.prototype.start = function(ms) {
    var _this = this;
    var tmpfn = function() {_this.getNextFrame()};
    this.timeout = setInterval(tmpfn, ms);
}

Game.prototype.getNextFrame = function() {
    var inputs = this.players.map(function(p) {return p.get_status();});
    this.state.update(inputs);
    var state = this.state.getState();
    for(var i=0; i<this.players.length;i++) {
	this.players[i].socket.send(i.toString() + ", " + state);
    }
}


module.exports = Game;
