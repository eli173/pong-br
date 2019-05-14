
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
    nearest_mod.translate(center.x, center.y);
    nearest_mod.rotate(-theta);
    // now i get the paddle's relative position along the line, and use that to compare with
    if(!data.paddles.some(p => p.id==data.id))
	return;
    var my_paddle = data.paddles.find(p => p.id == data.id);
    // largely stolen from getPaddlePoints
    var ep_len = my_ep.getLength();
    var pspace_len = ep_len-c.WIDTH_RATIO*ep_len;
    var idk_len = (ep_len-pspace_len)/2;
    var paddle_ratio = (my_paddle.pos+1)/2;
    var center_pos = idk_len+paddle_ratio*pspace_len;
    if(data.id==2)
	console.log(nearest_mod.x < center_pos, nearest_mod.x, center_pos);
    this.status = (nearest_mod.x < center_pos) ? 'd' : 'u';
}




Robot.prototype.bad_ai = function(data) {
    if(typeof data == "string")
	return;
    if(data.balls.length == 0)
	return;
    // this is where ALL the work needs to get done
    // i will start with a fairly naive approach, where i just move the paddle to the ball nearest to the region
    var me = data.id;
    var eps = field.genAllEndpoints(data.n, data.dead);
    var my_ep = eps.find(x => x.id == me);
    if(typeof my_ep == 'undefined') {
	this.status = 'x';
	return;
    }
    // recall that i strip out superfluous data... this is kinda tricky, just be careful
    var center = midpoint(my_ep.f, my_ep.s);
    var nearest = data.balls[0];
    var bdist2 = center.dist2(nearest);
    for(var ball of data.balls) {
	var newdist = center.dist2(ball);
	if(newdist < bdist2) {
	    nearest = ball;
	    bdist2 = newdist;
	}
    }
    // k now i've got the nearest... just move it in the direction of the nearest endpoint, yeah? yeah!
    // because the endpoints are given in increasing radians! Just have to do a check that
    if(nearest.dist2(my_ep.f) > nearest.dist2(my_ep.s)) {
	// double check which of 'u' or 'd' makes more sense, i think as is is probably fine but...
	this.status = 'u';
    }
    else {
	this.status = 'd';
    }
}

var midpoint = function(a,b) {
    return new Coord((a.x+b.x/2), (a.y+b.y)/2);
}
var ep_midpoint = function(e) {
    return midpoint(e.f, e.s);
}

module.exports = Robot;
