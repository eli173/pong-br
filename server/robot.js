
const c = require('./constants.js');

const Coord = require('./coord.js');
const field = require('./field.js');
const Endpoints = require('./endpoints.js');
const Paddle = require('./paddles.js'); // hacky? not too hacky.

function Robot() {
    this.status = 'x';
    this.isARobot = true;
}

Robot.prototype.close = function() {
    return;
}

Robot.prototype.get_status = function() {
    var stat = this.status;
    this.status = 'x';
    return stat;
}

Robot.prototype.send_data = function(data) {
    this.standard_ai(data);
}

Robot.prototype.random_ai = function(data) {
    // just a random-behaving ai. not pretty
    this.status = Math.random()>0.5 ? 'u' : 'd';
}
Robot.prototype.standard_ai = function(data) {
    if(typeof data == "string")
	return;
    if(data.balls.length == 0)
	return;
    var me = data.id;
    var eps = field.genAllEndpoints(data.n, data.dead);
    var my_ep = eps.find(x => x.id == me);
    if(typeof my_ep == 'undefined') {
	this.status = 'x';
	return;
    }
    var center = ep_midpoint(my_ep);
    var nearest = data.balls[0];
    var bdist2 = center.dist2(nearest);
    for(var ball of data.balls) {
	var newdist = center.dist2(ball);
	if(newdist < bdist2) {
	    nearest = ball;
	    bdist2 = newdist;
	}
    }
    var theta = Math.atan2(my_ep.s.y-my_ep.f.y, my_ep.s.x-my_ep.f.x);
    // not totally sure if i need this copy, dunno where else the object is used...
    var nearest_mod = new Coord(nearest.x, nearest.y)
    var paddle = data.paddles.find(p => p.id == data.id);
    if(typeof paddle == 'undefined')
	return;
    var pobj = new Paddle(data.id);
    pobj.position = paddle.pos;
    var pps = pobj.getPaddlePoints(my_ep);
    var paddle_center = ep_midpoint(pps);
    nearest_mod.translate(-paddle_center.x, -paddle_center.y);
    nearest_mod.rotate(-theta);
    
    this.status = (nearest_mod.x < 0) ? 'u' : 'd';
    // if it's close enough just stay still though
    if(Math.abs(nearest_mod.x) < 0.2) this.status = 'x';
}

var midpoint = function(a,b) {
    return new Coord((a.x+b.x)/2, (a.y+b.y)/2);
}
var ep_midpoint = function(e) {
    return midpoint(e.f, e.s);
}

module.exports = Robot;
