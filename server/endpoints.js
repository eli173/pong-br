

var Endpoints = function(f,s,id) {
    // f,s are first, second coordinates, in increasing angle
    // id corresponds to a player, or -1 or smth if n/a
    // these endpoints enclose a paddle
    this.f = f;
    this.s = s;
    this.id = id;
}


module.exports = Endpoints;
