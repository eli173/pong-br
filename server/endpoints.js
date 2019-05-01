

const c = require('./constants.js');

var Endpoints = function(f,s,id) {
    // f,s are first, second coordinates, in increasing angle
    // id corresponds to a player, or -1 or smth if n/a
    // these endpoints enclose a paddle
    this.f = f;
    this.s = s;
    this.id = id;
}

var AnglePair = function(f,s,id) {
    this.f = f;
    this.s = s;
    this.id = id;
}

Endpoints.prototype.getAngles = function() {
    // gets an anglepair for the endpoints. does assume the first angle is before second
    var fst = Math.atan2(this.f.y, this.f.x);
    var snd = Math.atan2(this.s.y, this.s.x);
    if(snd < fst) {
	snd += 2*Math.PI;
    }
    return new AnglePair(fst-c.ANGLE_THRESH, snd+c.ANGLE_THRESH, this.id);
}

module.exports = Endpoints;
