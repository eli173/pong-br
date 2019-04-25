// NOTE: inputs all get updated, forever will be length n, should work fine as-is

const c = require('./constants.js');

const Coord = require('./coord.js');
const Ball = require('./ball.js');

function Dead(id) {
    this.id = id;
    this.time = c.DYING_TIME_IN_FRAMES;
}

function GameState(n) {
    this.numPlayers = n;
    this.numLiving = n;
    this.dead = [];
    this.paddles = [];
    for(var i=0;i<n;i++) {
	this.paddles.push(new Paddle(n));
    }
    this.balls = [];
    for(var i=0;i<starting_balls(n);i++) {
	this.balls.push(new Ball();)
    }
}

function starting_balls(n) {
    // gives back the number of balls to start with given n players
    // change this function for either more or less fun
    return n;
}


function nearest_point_on_line(c, ep) {
    // finds the point on the line defined by ep closest to center c
    if(ep.f.x == ep.s.x) {
	// vertical line, undef slope
	return new Coord(ep.f.x, c.y);
    }
    if(ep.f.y == ep.s.y) {
	// horizontal line, zero slope
	return new Coord(c.x, ep.f.y);
    }
    var sl = (ep.f.y-ep.s.y)/(ep.f.x-ep.s.x);
    var sr = 1/sl;
    var x_int = (sl*ep.f.x - sr*c.x + c.y - ep.f.y)/(sl-sb);
    var y_int = sr*(x_int-c.x) + c.y;
    return new Coord(x_int, y_int);
}

GameState.prototype.update = function(inputs) {
    // inputs is an array of the characters from all the players (even dead? yeah)
    // move the paddles
    for(var i=0;i<this.paddles.length;i++) {
	paddles[i].move(inputs[paddles[i].id]); //hacky and bad, requires the inputs be
    }
    //move the balls
    for(var ball in this.balls) {
	ball.coord.x += ball.dx;
	ball.coord.y += ball.dy;
    }
    //
    var endpoints = genEndpoints(this.numPlayers, this.dead);
    var borders = endpointNegatives(endpoints);
    var deadzones = endpoints.filter(ep => ep.isDead);
    var walls = borders.concat(deadzones);    
    // check for collisions
    for(var ball in this.balls) {
	// (check the fixt edges first, then the paddles I guess
	var collided = false;
	for(var i=0; (i<walls.length) && !collided; i++) {
	    var nearest = nearest_point_on_line(ball.coord, walls[i]);
	    var dist2 = ball.coord.dist2(nearest);
	    if(dist2 < (ball.radius*ball.radius)) {
		// we have a collision!
		collided = true;
		var vec = [walls[i].f.x-walls[i].s.x, walls[i].f.y-walls[i].s.y];
		var slope_angle = Math.atan2(vec[1],vec[0]);
		// rotate, reflect, rotate back
		var vel_coord = new Coord(ball.dx, ball.dy);
		vel_coord.rotate(-slope_angle);
		vel_coord.x = -vel_coord.x;
		vel_coord.rotate(slope_angle);
		ball.dx = vel_coord.x;
		ball.dy = vel_coord.y;
		// increase speed slightly
		ball.speed_up();
	    }  
	}
	var livingzones = endpoints.filter(ep => !ep.isDead);
	for(var lz in livingzones) {
	    // get corresponding paddle
	    // should be guaranteed to find one.... so...
	    var paddle = this.paddles.find(p => p.id ==lz.id);
	    if((paddle !== undefined) && !collided) {
		var padends = paddle.getEndpoints(lz);
		var nearest = nearest_point_on_line(ball.coord, padends);
		var dist2 = ball.coord.dist2(nearest);
		if(dist2 < (ball.radius*ball.radius)) {
		    // we have a collision!
		    collided = true;
		    var vec = [padends.f.x-padends.s.x, padends.f.y-padends.s.y];
		    var slope_angle = Math.atan2(vec[1],vec[0]);
		    // rotate, reflect, rotate back
		    var vel_coord = new Coord(ball.dx, ball.dy);
		    vel_coord.rotate(-slope_angle);
		    vel_coord.x = -vel_coord.x;
		    // note: any 'too fast' errors will be solved in the 'speed_up' method, so i need not worry here
		    if(paddle.direction == 'u') { 
			vel_coord.x += c.PADDLE_MVT_BONUS;
		    }
		    else if(paddle.direction == 'd') {
			vel_coord.x -= c.PADDLE_MVT_BONUS;
		    }
		    vel_coord.rotate(slope_angle);
		    ball.dx = vel_coord.x;
		    ball.dy = vel_coord.y;
		    // increase speed slightly
		    ball.speed_up();
		}  
	    }
	}
    }
    // check for deaths
    // OK I'M HERE AFAICT
    // i don't need to check where any of the paddles are, I just need to check the spaces behind the paddles (±)
    var zero = new Coord(0,0);
    var oobs = this.balls.filter(b => (b.dist2(zero)>(c.BOARD_RADIUS+c.OOB_THRESH)));
    var angs = angles(this.numPlayers, this.dead, c.ANGLE_THRESH);
    for(var oob in oobs) {
	var oobth = oob.get_angle();
	for(var ang in angs) {
	    // normalise angle pair...
	    // this gon be inefficient sigh
	    var a1 = ang.f;
	    var a2 = ang.s;
	    while(oobth > (a1-2*Math.PI))
		oobth -= 2*Math.PI;
	    while( a2 > (oobth-2*Math.PI))
		a2 -= 2*Math.PI;
	    if((a2-a1) < 2*Math.PI) { // it's in between! (I should check my math...)
		// check if not already dead (in case multi balls out at same time etc)
		if(!this.dead.some(x => x.id == ang.id)) {
		    this.dead.push(new Dead(ang.id));
		    /* TODO: socket cleanup for dead player */
		}
	    }
	}
	// remove the ball
	var idx = this.balls.indexOf(oob);
	this.balls.splice(idx, 1);
    }
    // spawn new balls? sure why not. maybe tweak this for more or less fun later on
    if(this.balls.length < (this.numPlayers-this.dead.length)-1) {
	this.balls.push(new Ball());
    }
}

GameState.prototype.getState = function() {
    // returns a string suitable to be broadcast to all the players
    return this.inputs.join("");
}

module.exports = GameState;
