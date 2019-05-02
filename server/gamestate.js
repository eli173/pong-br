// NOTE: inputs all get updated, forever will be length n, should work fine as-is

const c = require('./constants.js');

const Coord = require('./coord.js');
const Ball = require('./ball.js');
const field = require('./field.js');
const Paddle = require('./paddles.js');
const collisions = require('./collisions.js');

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
	this.paddles.push(new Paddle(i));
    }
    this.balls = [];
    for(var i=0;i<starting_balls(n);i++) {
	this.balls.push(new Ball());
    }
}

function starting_balls(n) {
    // gives back the number of balls to start with given n players
    // change this function for either more or less fun
    return n;
}


GameState.prototype.update = function(inputs) {
    // inputs is an array of the characters from all the players (even dead? yeah)
    // move the paddles
    for(var i=0;i<this.paddles.length;i++) {
	this.paddles[i].move(inputs[this.paddles[i].id]); //hacky and bad, requires the inputs be
    }
    //move the balls
    // can i increase efficiency or sensibility by doing this later? maybe. should i? unlikely rn
    for(var ball of this.balls) {
	ball.coord.x += ball.dx;
	ball.coord.y += ball.dy;
    }
    //
    var endpoints = field.genAllEndpoints(this.numPlayers, this.dead);
    var livingzones = endpoints.filter(e => (e.id != -1));
    livingzones = livingzones.filter(e => !this.dead.some(d => (d.id==e.id))); // bad time complexity?
    var walls = endpoints.filter(e => (e.id == -1) || this.dead.some(d => (d.id==e.id)));
    // check for collisions
    for(var ball of this.balls) {
	var collided = false;
	// first, see if the ball is moving towards the center (should solve most problems with things
	var currd2 = ball.coord.dist2origin();
	var nextd2 = new Coord(ball.coord.x + ball.dx, ball.coord.y + ball.dy).dist2origin();
	if(nextd2 < currd2)
	    continue;

	// below here probably requires changes
	// (check the fixt edges first, then the paddles I guess
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
		vel_coord.y = -vel_coord.y;
		vel_coord.rotate(slope_angle);
		ball.dx = vel_coord.x;
		ball.dy = vel_coord.y;
		// increase speed slightly
		ball.speed_up();
	    }  
	}
	for(var lz of livingzones) {
	    // get corresponding paddle
	    // should be guaranteed to find one.... so...
	    var paddle = this.paddles.find(p => p.id ==lz.id);
	    if((paddle !== undefined) && !collided) {
		var padends = paddle.getPaddlePoints(lz);
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
		    vel_coord.y = -vel_coord.y;
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
    // shrink the existing dead zones for the future
    for(var d of this.dead) {
	if(d.time > 0)
	    d.time--;
    }
    
    // check for deaths
    // i don't need to check where any of the paddles are, I just need to check the spaces behind the paddles (±)

    var zero = new Coord(0,0);
    var oobs = this.balls.filter(b => (b.coord.dist2(zero)>(c.BOARD_RADIUS+c.OOB_THRESH)**2));
    var angs = livingzones.map(eps => eps.getAngles());
    //var angs = field.angles(this.numPlayers, this.dead, c.ANGLE_THRESH);
    for(var oob of oobs) {
	var oobth = oob.get_angle();
	for(var ang of angs) {
	    // normalise angle pair...
	    // this gon be inefficient sigh
	    var a1 = ang.f % (2*Math.PI);
	    var a2 = ang.s % (2*Math.PI);
	    var ab = oobth % (2*Math.PI);
	    if(a1 > a2) {
		a2 += 2*Math.PI;
	    }
	    if (a1 > ab) {
		ab += 2*Math.PI;
	    }
	    if((ab > a1) && (ab < a2)) {
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
    // only need the dead, balls, and paddles, everything else can be determined
    // dead don't need changing, all info is necessary
    var newballs = this.balls.map(b => b.reduce());
    var newpads = this.paddles.map(p => p.reduce());
    var thedead = this.dead;
    var totnum = this.numPlayers;
    var theobject = {n: totnum, dead: thedead, paddles: newpads, balls: newballs};
    return theobject;
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
    var x_int = (sl*ep.f.x - sr*c.x + c.y - ep.f.y)/(sl-sr);
    var y_int = sr*(x_int-c.x) + c.y;
    return new Coord(x_int, y_int);
}


module.exports = GameState;
