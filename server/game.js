
const GameState = require('./gamestate.js');

const health = require('./health.js');

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
    var tmpfn2 = function() {_this.setInt(tmpfn, ms);};
    setTimeout(tmpfn2, 3000);
    for(var player of players) {
	player.send_data('starting');
    }
}
Game.prototype.setInt = function(fn, ms) {
    this.timeout = setInterval(fn, ms);
}

Game.prototype.getNextFrame = function() {
    var inputs = this.players.map(function(p) {return p.get_status();});
    this.state.update(inputs);
    var state = this.state.getState();
    state.id = 0;
    for(var i=0; i<this.players.length;i++) {
	state.id = i;
	this.players[i].send_data(state);
    }

    // check for only robots left
    /*if(!this.players.some(x => !x.isARobot)) { // not true that some player isn't a robot
	clearInterval(this.timeout);
	health.dec();
    }*/
    
    // check for life and death
    var dead_ids = state.dead.map(d => d.id);
    if(dead_ids.length == state.n-1) {
	// game over! tell everyone and end the cycle
	clearInterval(this.timeout);
	health.dec();
	var sum = dead_ids.reduce((x,y) => x+y);
	var winner = state.n*(state.n-1)/2 - sum; // note the minus is bc we start at zero yeah?
	for(var i=0; i<this.players.length;i++) {
	    var tosend = (i==winner) ? 'w' : 'l';
	    this.players[i].send_data(tosend); // w for winner, l for loser cuz why not?
	    this.players[i].close();
	}
    }
}


module.exports = Game;
