
const DYING_TIME_IN_FRAMES = 100;

function Dead(id) {
    this.id = id;
    this.time = DYING_TIME_IN_FRAMES;
}

function GameState(n) {
    this.numLiving = n;
    this.dead = [];
    this.inputs = [];
}

GameState.prototype.update = function(inputs) {
    this.inputs = inputs;
    // TODO: all of the rest of this
}
GameState.prototype.getState = function() {
    // returns a string suitable to be broadcast to all the players
    return this.inputs.join("");
}

module.exports = GameState;
