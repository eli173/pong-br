// NOTE: inputs all get updated, forever will be length n, should work fine as-is

const c = require('./constants.js');

const Coord = require('./coord.js');
const Ball = require('./ball.js');
const field = require('./field.js');
const Paddle = require('./paddles.js');
const collisions = require('./collisions.js');

function Dead(id, pl) {
    this.id = id;
    this.place = pl;
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
	var nextd2 = new Coord(ball.coord.x + ball.dx/c.FPS, ball.coord.y + ball.dy/c.FPS).dist2origin();
	if(nextd2 < currd2)
	    continue;

	// below here probably requires changes
	// (check the fixt edges first, then the paddles I guess
	if(collisions.handleWalls(ball, walls)) {
	    continue;
	}
	if(collisions.handlePaddles(ball, livingzones, this.paddles)) {
	    continue;
	}
	// i put that last continue but there's nothing left to do...
    }
    
    // shrink the existing dead zones for the future
    for(var d of this.dead) {
	if(d.time > 0)
	    d.time--;
    }
    
    // check for deaths
    // i don't need to check where any of the paddles are, I just need to check the spaces behind the paddles (±)

    //    var zero = new Coord(0,0);
    //    var oobs = this.balls.filter(b => (b.coord.dist2(zero)>(c.BOARD_RADIUS+c.OOB_THRESH)**2));
    var oobs = this.balls.filter(b => endpoints.some(e => !left_of(b.coord, e))); // ball to the right of smth
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
		    var place = this.numPlayers - this.dead.length;
		    this.dead.push(new Dead(ang.id, place));
		    /* TODO: socket cleanup for dead player */
		}
	    }
	}
    }
    // remove far away balls
    var oob2 = this.balls.filter(b => (b.coord.dist2origin()>(c.BOARD_RADIUS+c.OOB_THRESH)**2));
    for(var b of oob2) {
	var idx = this.balls.indexOf(b);
	this.balls.splice(idx, 1);
    }
    
    // spawn new balls? sure why not. maybe tweak this for more or less fun later on
    if(this.balls.length < (this.numPlayers-this.dead.length)-1) {
	this.balls.push(new Ball());
    }
        //move the balls
    for(var ball of this.balls) {
	ball.coord.x += ball.dx/c.FPS;
	ball.coord.y += ball.dy/c.FPS;
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
    // maybe a proper constructor would be good here...
    return theobject;
}


var left_of = function(c, ep) {
    // tells if coord c is to the left of an endpoint set (incr in angle)
    // idea is that if all are left of then the ball is inbounds

    // translate everything to origin
    var f = new Coord(0,0);
    var s = new Coord(ep.s.x-ep.f.x, ep.s.y-ep.f.y);
    var b = new Coord(c.x-ep.f.x, c.y-ep.f.y);
    // rotate about the origin
    var th = Math.atan2(s.y, s.x);
    b.rotate(-th);
    return b.y >= 0;
}

module.exports = GameState;
