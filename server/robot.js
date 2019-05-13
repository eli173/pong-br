
const c = require('./constants.js');

const Coord = require('./coord.js');
const field = require('./field.js');

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


module.exports = Robot;
