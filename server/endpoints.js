

const c = require('./constants.js');
const Coord = require('./coord.js');
const Vec = Coord;

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

Endpoints.prototype.getLength = function() {
    return Math.sqrt(this.f.dist2(this.s));
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
Endpoints.prototype.elongate = function(v) {
    // stretches the endpoints by multiple of v
    var to_s = new Vec(v*(this.s.x-this.f.x), v*(this.s.y-this.f.y)); 
    var to_f = new Vec(v*(this.f.x-this.s.x), v*(this.f.y-this.s.y));
    // stretched vectors pointing in to s from f and vice versa
    to_f.translate(this.s.x, this.s.y);
    to_s.translate(this.f.x, this.f.y);
    return new Endpoints(to_f, to_s)
}


module.exports = Endpoints;
