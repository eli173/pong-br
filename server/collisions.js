
const c = require('./constants.js');
const Coord = require('./coord.js');

const Endpoints = require('./endpoints.js'); // i guess slightly useful here

const Matrix = require('./matrix.js');

const Vec = Coord; // hah

/*
 * okay, game plan:
 * we look at line segments: the segments from the endpoints,
 * and segments defined by the balls' current and future positions
 * 
 * once that is done, I still need to fix the bounce issue.
 * dunno if that part is good or not. i suspect it's okay
*/

var segments_intersect = function(e1, e2) {
    // takes 2 sets of endpoints for the segments
    // variables for easier reference, thinking
    var x1 = e1.f.x;
    var y1 = e1.f.y;
    var x2 = e1.s.x;
    var y2 = e1.s.y;
    var x3 = e2.f.x;
    var y3 = e2.f.y;
    var x4 = e2.s.x;
    var y4 = e2.s.y;
    // first check if parallel, with nice algebra to avoid verticality issues
    if((x3-x4)*(y1-y2) == (x1-x2)*(y3-y4))
	return false;
    // stolen from wikipedia
    var x_val = ((x1*y2-y1*x2)*(x3-x4)-(x1-x2)*(x3*y4-y3*x4))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
    var y_val = ((x1*y2-y1*x2)*(y3-y4)-(y1-y2)*(x3*y4-y3*x4))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));


    if(x_val < Math.min(x1,x2)) return false;
    if(x_val > Math.max(x1,x2)) return false;
    if(y_val < Math.min(y1,y2)) return false;
    if(y_val > Math.max(y1,y2)) return false;
    if(x_val < Math.min(x3,x4)) return false;
    if(x_val > Math.max(x3,x4)) return false;
    if(y_val < Math.min(y3,y4)) return false;
    if(y_val > Math.max(y3,y4)) return false;
    return true;
}


Vec.prototype.normalize = function(vec) {
    var mag = Math.sqrt(this.x**2 + this.y**2);
    this.x = this.x/mag;
    this.y = this.y/mag;
}

var handleWalls = function(ball, walls) {
    // returns true if there's a collision
    // modifies ball's velocity if it encounters an actual collision
    // wall is an endpoints
    for(var wall of walls) {
	var stretched = wall.elongate(1.2); // this is done to fix collision detection?
	var next_spot = new Coord(ball.coord.x + ball.dx/c.FPS, ball.coord.y + ball.dy/c.FPS); // the next spot
	var ball_ep = new Endpoints(ball.coord, next_spot)
	if(segments_intersect(wall, ball_ep.elongate(1.2))) {
	    //there's a collision
	    var wall_normal = new Vec((wall.f.x+wall.s.x)/2, (wall.f.y+wall.s.y)/2); // given by the midpoint
	    wall_normal.normalize();
	    var wall_parallel = new Vec(wall.s.x - wall.f.x, wall.s.y - wall.f.y);
	    wall_parallel.normalize();
	    // there's our basis vectors
	    var vel = new Vec(ball.dx, ball.dy);
	    var tr_mat = new Matrix(wall_parallel.x, wall_parallel.y, wall_normal.x, wall_normal.y);
	    var vel_in_basis = tr_mat.vmul(vel);
	    // now in the basis this is easy, I just swap the right variable, then transform back, and reassign!
	    // the x-coord is along the wall, y is along the normal i think, sooo...
	    vel_in_basis.y = -vel_in_basis.y;
	    vel = tr_mat.inverse().vmul(vel_in_basis);
	    ball.dx = vel.x;
	    ball.dy = vel.y;
	    ball.speed_up();
	    return true;
	}
    }
    return false;
}


var handlePaddles = function(ball, lzs, paddles) {
    // same, but with paddles and speed movement bonus
    // i iterate over lzs, get matching paddle
    for(var lz of lzs) {
	var paddle = paddles.find(p => p.id==lz.id);
	if(paddle === undefined) { // this is badd...
	    console.log("paddle not found...");
	    return false;
	}
	var wall = paddle.getPaddlePoints(lz);
	//
	var next_spot = new Coord(ball.coord.x + ball.dx/c.FPS, ball.coord.y + ball.dy/c.FPS); // the next spot
	if(segments_intersect(wall, new Endpoints(ball.coord, next_spot))) {
	    //there's a collision
	    var wall_normal = new Vec((wall.f.x+wall.s.x)/2, (wall.f.y+wall.s.y)/2); // given by the midpoint
	    wall_normal.normalize();
	    var wall_parallel = new Vec(wall.s.x - wall.f.x, wall.s.y - wall.f.y);
	    wall_parallel.normalize();
	    // there's our basis vectors
	    var vel = new Vec(ball.dx, ball.dy);
	    var tr_mat = new Matrix(wall_parallel.x, wall_parallel.y, wall_normal.x, wall_normal.y);
	    var vel_in_basis = tr_mat.vmul(vel);
	    // now in the basis this is easy, I just swap the right variable, then transform back, and reassign!
	    // the x-coord is along the wall, y is along the normal i think, sooo...
	    vel_in_basis.y = -vel_in_basis.y;
	    // do the paddle bonus here too
	    if(paddle.direction == 'u')
		vel_in_basis.x += c.PADDLE_MVT_BONUS;
	    else if(paddle.direction == 'd')
		vel_in_basis.x -= c.PADDLE_MVT_BONUS;
	    vel = tr_mat.inverse().vmul(vel_in_basis);
	    ball.dx = vel.x;
	    ball.dy = vel.y;
	    ball.speed_up();
	    return true;
	}
    }
    return false;
}


module.exports = {handleWalls: handleWalls, handlePaddles, handlePaddles, segments_intersect: segments_intersect};
