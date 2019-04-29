
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
