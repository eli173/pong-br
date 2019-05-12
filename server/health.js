
const c = require('./constants.js');

var Health = function() {
    this.game_count = 0;
}

Health.prototype.inc = function() {
    this.game_count++;
}
Health.prototype.dec = function() {
    this.game_count--;
}
Health.prototype.isOK = function() {
    return this.game_count >= c.MAX_GAMES;
}

// testing shows this probably does what I want it to do
module.exports = new Health();
