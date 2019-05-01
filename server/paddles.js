
const c = require('./constants.js')

const Coord = require('./coord.js')
const Endpoints = require('./endpoints.js')

var Paddle = function(id) {
    // position is supposed to range between ±1
    this.id = id;
    this.position = 0;
    this.direction = 'x';
}

Paddle.prototype.move = function(direction) {
    // direction is either 'u', 'd', or 'x', passed along from the inputs gathered elsewhere
    if((direction=='u') && (this.position < 1)) {
	this.position += c.DPADDLE;
	this.direction = 'u';
    }
    else if((direction=='d') && (this.position > -1)) {
	this.position -= c.DPADDLE;
	this.direction = 'd'
    }
    else {
	this.direction = 'x';
    }
}

function dist(p1,p2) {
    var x = p1.x - p2.x;
    var y = p1.y-p2.y
    return Math.sqrt(x*x+y*y);
    
}

Paddle.prototype.getPaddlePoints = function(enclosing) {
    var encl_len = dist(enclosing.f, enclosing.s);
    var pspace_len = encl_len - c.WIDTH_RATIO*encl_len;
    var idk_len = (encl_len - pspace_len)/2; // the length between the highest paddle center location and the edge
    var paddle_ratio = (this.position+1)/2; // converts the -1-to-1-centered 'position' to a 0-1 ratio
    var center_pos = idk_len + paddle_ratio*pspace_len; // length from one of the endpoints (which one? does it matter?)
    var fst_pos = center_pos - c.WIDTH_RATIO*encl_len/2;
    var snd_pos = center_pos + c.WIDTH_RATIO*encl_len/2;
    var fst_pct = fst_pos/encl_len;
    var snd_pct = snd_pos/encl_len;
    var fst_x = enclosing.f.x*fst_pct + enclosing.s.x*(1-fst_pct);
    var fst_y = enclosing.f.y*fst_pct + enclosing.s.y*(1-fst_pct);
    var snd_x = enclosing.f.x*snd_pct + enclosing.s.x*(1-snd_pct);
    var snd_y = enclosing.f.y*snd_pct + enclosing.s.y*(1-snd_pct);
    var fst = new Coord(fst_x, fst_y);
    var snd = new Coord(snd_x, snd_y);
    return new Endpoints(fst, snd, this.id);
}

Paddle.prototype.getEndpoints = function(enclosing) {
    // returns an endpoints object for the paddle
    // given the desired width of said paddle and the enclosing endpoints
    var encl_len = dist(enclosing.f, enclosing.s);
    var pspace_len = encl_len - (2*c.WIDTH_RATIO*encl_len);
    var place_on_pspace = pspace_len*(this.position+1)/2;
    var above_f = pspace_len + c.WIDTH_RATIO;  // distance above the first enclosing point (takes advantage of the increasing in angle thing to determine orientations)
    var overall_proportion = above_f/encl_len;
    var vector = [enclosing.s.x-enclosing.f.x, enclosing.s.y-enclosing.f.y];
    var d = overall_proportion-c.WIDTH_RATIO;
    var first = new Coord(vector[0]*d, vector[1]*d);
    d = overall_proportion+c.WIDTH_RATIO;
    var second = new Coord(vector[0]*d, vector[1]*d);
    return new Endpoints(first, second, this.id);
}

Paddle.prototype.reduce = function() {
    var theid = this.id;
    var thepos = this.position;
    return {id:theid, pos:thepos};
}


module.exports = Paddle;
