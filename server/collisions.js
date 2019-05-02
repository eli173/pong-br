
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
    for(var wall of walls) {
	var nearest = nearest_point_on_line(ball.coord, wall);
	if(ball.coord.dist2(nearest) < (ball.radius)**2) { // there's a collision
	    // so the midpoint of the wall gives a nice normal vector
	    var norm = ball.coord;
	}
    }

}

var handlePaddles = function() {

}

module.exports = {handleWalls: handleWalls, handlePaddles, handlePaddles};
