
function GameState() {
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
