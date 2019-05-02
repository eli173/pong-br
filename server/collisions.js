
const c = require('./constants.js');
const Coord = require('./coord.js');

const Endpoints = require('./endpoints.js'); // i guess slightly useful here

/*
 * okay, game plan:
 * we look at line segments: the segments from the endpoints,
 * and segments defined by the balls' current and future positions
 * 
 * once that is done, I still need to fix the bounce issue.
 * dunno if that part is good or not. i suspect it's okay
*/

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

    if(Math.min(x1, x2) < x_val && x_val < Math.max(x1, x2))
	return false;
    if(Math.min(y1, y2) < y_val && y_val < Math.max(y1, y2))
	return false;
    if(Math.min(x3, x4) < x_val && x_val < Math.max(x3, x4))
	return false;
    if(Math.min(y3, y4) < y_val && y_val < Math.max(y3, y4))
	return false;
    return true;
}


var handleWalls = function(ball, walls) {
    // returns true if there's a collision
    // modifies ball's velocity if it encounters an actual collision
    // wall is an endpoints
    for(var wall of walls) {
	var next_spot = new Coord(ball.coord.x + ball.dx, ball.coord.y + ball.dy);
	if(segments_intersect(wall, new Endpoints(ball.coord, next_spot))) {
	    //there's a collision
	    console.log("int");
	    var wall_normal = new Coord((wall.f.x+wall.s.x)/2, (wall.f.y+wall.s.y)/2); // given by the midpoint
	    var normal_angle = Math.atan2(wall_normal.x, wall_normal.y);
	    var vel_vec = new Coord(ball.dx, ball.dy);
	    vel_vec.rotate(-normal_angle);
	    vel_vec.x = -vel_vec.x; // i'm fairly certain it's x...
	    vel_vec.rotate(normal_angle);
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
	var paddle = this.paddles.find(p => p.id==lz.id);
	if(paddle === undefined) { // this is badd...
	    console.log("paddle not found...");
	    return false;
	}
	var wall = paddle.getPaddlePoints(lz);
	//
	var next_spot = new Coord(ball.coord.x + ball.dx, ball.coord.y + ball.dy);
	if(segments_intersect(walls, new Endpoints(ball.coord, next_spot))) {
	    //there's a collision
	    var wall_normal = new Coord((wall.f.x+wall.s.x)/2, (wall.f.y+wall.s.y)/2); // given by the midpoint
	    var normal_angle = Math.atan2(wall_normal.x, wall_normal.y);
	    var vel_vec = new Coord(ball.dx, ball.dy);
	    vel_vec.rotate(-normal_angle);
	    vel_vec.x = -vel_vec.x; // i'm fairly certain it's x...
	    if(paddle.direction == 'u')
		vel_vec.y += c.PADDLE_MVT_BONUS;
	    else if(paddle.direction == 'd')
		vel_vec.y -= c.PADDLE_MVT_BONUS;
	    vel_vec.rotate(normal_angle);
	    ball.speed_up();
	    return true;
	}
    }
    return false;
}


module.exports = {handleWalls: handleWalls, handlePaddles, handlePaddles};
